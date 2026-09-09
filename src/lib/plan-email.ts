import { ScheduleGroup, SupplementRecommendation, TimeOfDay } from "@/types";

type EmailLocale = "en" | "it";

const COPY: Record<
  EmailLocale,
  {
    subject: string;
    preheader: string;
    heading: string;
    intro: string;
    timeLabels: Record<TimeOfDay, string>;
    withFood: string;
    withFat: string;
    alreadyTaking: string;
    evidence: Record<"high" | "moderate" | "low", string>;
    evidenceLabel: string;
    sproutHeading: string;
    sproutIncludes: (n: number) => string;
    shop: (name: string) => string;
    disclaimer: string;
    footerNote: string;
    openPlan: string;
  }
> = {
  en: {
    subject: "Your evidence-based supplement plan",
    preheader: "Your full daily schedule: what to take, when, and how.",
    heading: "Your supplement plan",
    intro:
      "Here is your personalized plan, based on the answers you gave. Keep this email for reference. Nothing was saved on our side.",
    timeLabels: { morning: "Morning", afternoon: "Afternoon", evening: "Evening" },
    withFood: "with food",
    withFat: "with a source of fat",
    alreadyTaking: "already in your routine",
    evidence: { high: "High evidence", moderate: "Moderate evidence", low: "Limited evidence" },
    evidenceLabel: "Evidence",
    sproutHeading: "Sprout Lab formulas that match your plan",
    sproutIncludes: (n) => `Covers ${n} of your recommended ingredients`,
    shop: (name) => `Shop ${name}`,
    disclaimer:
      "This plan is educational and not medical advice. Talk to a doctor or pharmacist before starting any supplement, especially if you take medication, are pregnant or breastfeeding, or have a health condition.",
    footerNote: "Sprout - evidence-based supplement planner",
    openPlan: "Open the planner",
  },
  it: {
    subject: "Il tuo piano di integratori basato su evidenze",
    preheader: "Il tuo programma giornaliero completo: cosa prendere, quando e come.",
    heading: "Il tuo piano di integratori",
    intro:
      "Ecco il tuo piano personalizzato, basato sulle risposte che hai dato. Conserva questa email come riferimento. Non abbiamo salvato nulla da parte nostra.",
    timeLabels: { morning: "Mattina", afternoon: "Pomeriggio", evening: "Sera" },
    withFood: "a stomaco pieno",
    withFat: "con una fonte di grassi",
    alreadyTaking: "già nella tua routine",
    evidence: { high: "Evidenza alta", moderate: "Evidenza moderata", low: "Evidenza limitata" },
    evidenceLabel: "Evidenza",
    sproutHeading: "Formule Sprout Lab in linea con il tuo piano",
    sproutIncludes: (n) => `Copre ${n} degli ingredienti raccomandati`,
    shop: (name) => `Acquista ${name}`,
    disclaimer:
      "Questo piano ha scopo informativo e non è un consiglio medico. Parla con un medico o un farmacista prima di iniziare qualsiasi integratore, soprattutto se assumi farmaci, sei in gravidanza o allattamento, o hai una condizione di salute.",
    footerNote: "Sprout - pianificatore di integratori basato su evidenze",
    openPlan: "Apri il pianificatore",
  },
};

export type SproutEmailProduct = {
  name: string;
  tagline: string;
  url: string;
  matchedCount: number;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function timingLine(s: SupplementRecommendation, c: (typeof COPY)[EmailLocale]): string {
  const bits: string[] = [];
  if (s.timing.withFood) bits.push(c.withFood);
  if (s.timing.withFat) bits.push(c.withFat);
  return bits.join(" · ");
}

export function renderPlanEmail(opts: {
  schedule: ScheduleGroup[];
  sproutProducts: SproutEmailProduct[];
  locale: EmailLocale;
  plannerUrl: string;
}): { subject: string; html: string } {
  const { schedule, sproutProducts, locale, plannerUrl } = opts;
  const c = COPY[locale];

  const brown = "#2E1B12";
  const amber = "#FFB326";
  const muted = "#9C8B78";
  const bg = "#FCFCF7";

  const scheduleHtml = schedule
    .map((group) => {
      const rows = group.supplements
        .map((s) => {
          const timing = timingLine(s, c);
          return `
            <tr>
              <td style="padding:14px 0;border-bottom:1px solid rgba(46,27,18,0.1);">
                <div style="font-size:15px;font-weight:600;color:${brown};">
                  ${esc(s.name)}${s.alreadyTaking ? ` <span style="font-size:11px;font-weight:400;color:${muted};">(${esc(c.alreadyTaking)})</span>` : ""}
                </div>
                <div style="font-size:13px;color:${brown};margin-top:2px;">${esc(s.dosage)}</div>
                ${timing ? `<div style="font-size:12px;color:${muted};margin-top:2px;">${esc(timing)}</div>` : ""}
                <div style="font-size:11px;color:${muted};margin-top:4px;text-transform:uppercase;letter-spacing:0.08em;">${esc(c.evidenceLabel)}: ${esc(c.evidence[s.evidenceLevel])}</div>
              </td>
            </tr>`;
        })
        .join("");
      return `
        <tr><td style="padding-top:26px;">
          <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:${muted};padding-bottom:6px;border-bottom:2px solid ${brown};">
            ${esc(c.timeLabels[group.timeOfDay])} &nbsp;·&nbsp; ${group.supplements.length}
          </div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
        </td></tr>`;
    })
    .join("");

  const sproutHtml = sproutProducts.length
    ? `
      <tr><td style="padding-top:34px;">
        <div style="font-size:16px;font-weight:700;color:${brown};margin-bottom:12px;">${esc(c.sproutHeading)}</div>
        ${sproutProducts
          .map(
            (p) => `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#ffffff;border:1px solid rgba(46,27,18,0.12);margin-bottom:10px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:15px;font-weight:600;color:${brown};">${esc(p.name)}</div>
              <div style="font-size:13px;color:${muted};margin-top:2px;">${esc(p.tagline)}</div>
              <div style="font-size:12px;color:${amber};margin-top:6px;">${esc(c.sproutIncludes(p.matchedCount))}</div>
              <a href="${esc(p.url)}" style="display:inline-block;margin-top:10px;font-size:13px;color:${brown};text-decoration:underline;">${esc(c.shop(p.name))} →</a>
            </td></tr>
          </table>`
          )
          .join("")}
      </td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background:${bg};">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${esc(c.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid rgba(46,27,18,0.12);">
        <tr><td style="height:4px;background:${amber};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:32px 32px 8px;">
          <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${muted};">Sprout</div>
          <h1 style="margin:8px 0 0;font-size:26px;font-weight:400;color:${brown};">${esc(c.heading)}</h1>
          <p style="margin:14px 0 0;font-size:14px;line-height:1.6;color:${brown};">${esc(c.intro)}</p>
        </td></tr>
        <tr><td style="padding:0 32px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${scheduleHtml}
            ${sproutHtml}
          </td></tr>
        <tr><td style="padding:28px 32px 32px;">
          <a href="${esc(plannerUrl)}" style="display:inline-block;background:${amber};color:${brown};font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:999px;">${esc(c.openPlan)} →</a>
          <p style="margin:22px 0 0;font-size:11px;line-height:1.6;color:${muted};">${esc(c.disclaimer)}</p>
          <p style="margin:14px 0 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${muted};">${esc(c.footerNote)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject: c.subject, html };
}

export const emailSubject = (locale: EmailLocale) => COPY[locale].subject;
