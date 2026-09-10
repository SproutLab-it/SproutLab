import { NextRequest, NextResponse } from "next/server";
import { UserProfile } from "@/types";
import {
  generateRecommendations,
  groupBySchedule,
  validateProfile,
  getSproutProductWants,
  SPROUT_PRODUCT_MATCH_SLUGS,
} from "@/lib/recommendation-engine";
import { renderPlanEmail, SproutEmailProduct, AmazonEmailProduct } from "@/lib/plan-email";
import { AMAZON_PRODUCTS } from "@/lib/amazon-products";

export const runtime = "nodejs";

// Display metadata for the two Sprout Lab products. Mirrors SPROUTLAB_PRODUCTS
// in src/app/results/page.tsx (name / tagline / url only; the match logic
// itself comes from SPROUT_PRODUCT_MATCH_SLUGS in the engine).
const SPROUT_PRODUCT_META: Record<
  string,
  { name: string; tagline: string; taglineIt: string; url: string }
> = {
  mycofuel: {
    name: "Mycofuel",
    tagline: "Energy, endurance & adaptogens",
    taglineIt: "Energia, resistenza e adattogeni",
    url: "https://sproutlab.it/shop/mycofuel/",
  },
  mycoderm: {
    name: "Mycoderm",
    tagline: "Skin health, cellular protection & glow",
    taglineIt: "Salute della pelle, protezione cellulare e luminosità",
    url: "https://sproutlab.it/shop/mycoderm/",
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { email, profile, locale } = (body ?? {}) as {
    email?: unknown;
    profile?: unknown;
    locale?: unknown;
  };

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!profile || typeof profile !== "object") {
    return NextResponse.json({ error: "invalid_profile" }, { status: 400 });
  }

  const profileErrors = validateProfile(profile as Partial<UserProfile>);
  if (profileErrors.length > 0) {
    return NextResponse.json({ error: "invalid_profile", details: profileErrors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[send-plan] RESEND_API_KEY is not set");
    return NextResponse.json({ error: "email_not_configured" }, { status: 500 });
  }

  const emailLocale = locale === "it" ? "it" : "en";

  // Recompute the plan on the server so the email content can't be tampered with.
  const recommendations = generateRecommendations(profile as UserProfile, emailLocale);
  const schedule = groupBySchedule(recommendations);
  const recSlugs = new Set(recommendations.map((r) => r.slug));

  // Which product(s) to include is decided by goal + sex (see
  // getSproutProductWants), not by ingredient-match count — Mycofuel and
  // Mycoderm share most of their ingredient list, so a count-based guess
  // here could disagree with what the results page shows.
  const sproutWants = getSproutProductWants(profile as UserProfile);
  const sproutProducts: SproutEmailProduct[] = Object.entries(SPROUT_PRODUCT_MATCH_SLUGS)
    .filter(([id]) => sproutWants[id as "mycofuel" | "mycoderm"])
    .map(([id, matchSlugs]) => {
      const matchedCount = matchSlugs.filter((s) => recSlugs.has(s)).length;
      const meta = SPROUT_PRODUCT_META[id];
      if (!meta) return null;
      const { taglineIt, tagline, ...rest } = meta;
      return { ...rest, tagline: emailLocale === "it" ? taglineIt : tagline, matchedCount };
    })
    .filter((p): p is SproutEmailProduct => p !== null);

  // Non-Sprout recommendations that have an Amazon.it listing, mirroring the
  // "other supplements" grid in src/app/results/page.tsx.
  const sproutSlugs = new Set(Object.values(SPROUT_PRODUCT_MATCH_SLUGS).flat());
  const amazonProducts: AmazonEmailProduct[] = recommendations
    .filter((r) => !sproutSlugs.has(r.slug) && AMAZON_PRODUCTS[r.slug])
    .map((r) => {
      const meta = AMAZON_PRODUCTS[r.slug];
      return {
        name: r.name,
        brand: meta.brand,
        shortDesc: emailLocale === "it" ? meta.shortDescIt : meta.shortDesc,
        url: meta.url,
      };
    });

  const plannerUrl = new URL(req.url).origin;
  const { subject, html } = renderPlanEmail({
    schedule,
    sproutProducts,
    amazonProducts,
    locale: emailLocale,
    plannerUrl,
  });

  const from = process.env.PLAN_EMAIL_FROM || "Sprout <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [email.trim()], subject, html }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[send-plan] Resend responded ${res.status}: ${detail}`);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[send-plan] request to Resend failed", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  // Internal copy for the team, sent as its own separate email (not cc/bcc)
  // so the user's copy never reveals that admin also received one. Best
  // effort only — a failure here must not affect the user-facing response.
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || "admin@sproutlab.it";
  const adminHtml = html.replace(
    /<body([^>]*)>/,
    `<body$1><div style="background:#2E1B12;color:#FCFCF7;padding:12px 24px;font-family:sans-serif;font-size:13px;">Piano generato per: ${email.trim()}</div>`,
  );

  try {
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [adminEmail],
        subject: `[MyPlan] ${subject} — ${email.trim()}`,
        html: adminHtml,
      }),
    });

    if (!adminRes.ok) {
      const detail = await adminRes.text().catch(() => "");
      console.error(`[send-plan] admin copy: Resend responded ${adminRes.status}: ${detail}`);
    }
  } catch (err) {
    console.error("[send-plan] admin copy: request to Resend failed", err);
  }

  return NextResponse.json({ ok: true });
}
