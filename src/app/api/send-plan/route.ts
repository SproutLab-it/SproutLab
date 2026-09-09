import { NextRequest, NextResponse } from "next/server";
import { UserProfile } from "@/types";
import {
  generateRecommendations,
  groupBySchedule,
  validateProfile,
  SPROUT_PRODUCT_MATCH_SLUGS,
} from "@/lib/recommendation-engine";
import { renderPlanEmail, SproutEmailProduct } from "@/lib/plan-email";

export const runtime = "nodejs";

// Minimum shared ingredients for a Sprout product to count as a match.
// Keep in step with the ".filter" in src/app/results/page.tsx.
const SPROUT_MIN_MATCH = 2;

// Display metadata for the two Sprout Lab products. Mirrors SPROUTLAB_PRODUCTS
// in src/app/results/page.tsx (name / tagline / url only; the match logic
// itself comes from SPROUT_PRODUCT_MATCH_SLUGS in the engine).
const SPROUT_PRODUCT_META: Record<string, { name: string; tagline: string; url: string }> = {
  mycofuel: {
    name: "Mycofuel",
    tagline: "Energy, endurance & adaptogens",
    url: "https://sproutlab.it/shop/mycofuel/",
  },
  mycoderm: {
    name: "Mycoderm",
    tagline: "Skin health, cellular protection & glow",
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
  const recommendations = generateRecommendations(profile as UserProfile);
  const schedule = groupBySchedule(recommendations);
  const recSlugs = new Set(recommendations.map((r) => r.slug));

  const sproutProducts: SproutEmailProduct[] = Object.entries(SPROUT_PRODUCT_MATCH_SLUGS)
    .map(([id, matchSlugs]) => {
      const matchedCount = matchSlugs.filter((s) => recSlugs.has(s)).length;
      const meta = SPROUT_PRODUCT_META[id];
      return meta ? { ...meta, matchedCount } : null;
    })
    .filter((p): p is SproutEmailProduct => p !== null && p.matchedCount >= SPROUT_MIN_MATCH);

  const plannerUrl = new URL(req.url).origin;
  const { subject, html } = renderPlanEmail({
    schedule,
    sproutProducts,
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

  return NextResponse.json({ ok: true });
}
