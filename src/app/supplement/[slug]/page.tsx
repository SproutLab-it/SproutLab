import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { getSupplementBySlug, getAllSupplements } from "@/lib/recommendation-engine";
import { localizeSupplementData } from "@/lib/supplement-i18n";
import { getT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { BenefitRadarChart } from "@/components";


interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getLocale(): Promise<Locale> {
  const headerStore = await headers();
  return (headerStore.get("x-locale") ?? "en") as Locale;
}

export async function generateStaticParams() {
  const supplements = getAllSupplements();
  return supplements.map((supplement) => ({ slug: supplement.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const raw = getSupplementBySlug(slug);
  if (!raw) return { title: getT(locale).supplement.notFoundTitle };
  const supplement = localizeSupplementData(raw, locale);
  return { title: `${supplement.name} | Sprout`, description: supplement.description };
}

export default async function SupplementPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const raw = getSupplementBySlug(slug);
  if (!raw) notFound();
  const supplement = localizeSupplementData(raw, locale);
  const s = getT(locale).supplement;

  const foodNote = supplement.defaultTiming.withFood
    ? supplement.defaultTiming.withFat
      ? s.withMealFat
      : s.withFood
    : s.emptyStomach;

  const timeLabel = s.timeOfDay[supplement.defaultTiming.timeOfDay];
  const ev = { dot: { high: "bg-[#4A7C59]", moderate: "bg-[#FFB326]", low: "bg-[#2E1B12]/20" }[supplement.evidenceLevel], label: s.evidence[supplement.evidenceLevel] };

  return (
    <div className="grow bg-[#FCFCF7] pt-28 pb-6 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <Link href="/results" className="text-xs tracking-widest uppercase text-[#9C8B78] hover:text-[#2E1B12] transition-colors">
            {s.backToResults}
          </Link>
        </div>

        <div className="bg-white border border-[#2E1B12]/10">

          {/* Header */}
          <div className="p-8 md:p-12 border-b border-[#2E1B12]/10">
            <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-3">{s.kicker}</p>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-normal text-[#2E1B12] leading-tight">
                {supplement.name}
              </h1>
              <div className="flex items-center gap-1.5 flex-shrink-0 mt-2">
                <span className={`w-2 h-2 rounded-full ${ev.dot}`} />
                <span className="text-xs text-[#9C8B78]">{ev.label}</span>
              </div>
            </div>
            <p className="text-[#9C8B78] leading-relaxed">{supplement.description}</p>
          </div>

          {/* Quick facts */}
          <div className="grid grid-cols-3 divide-x divide-[#2E1B12]/10 border-b border-[#2E1B12]/10">
            <div className="p-6 md:p-8">
              <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-2">{s.dosage}</p>
              <p className="text-sm font-medium text-[#2E1B12]">{supplement.dosageRange}</p>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-2">{s.bestTime}</p>
              <p className="text-sm font-medium text-[#2E1B12]">{timeLabel}</p>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-2">{s.withFoodLabel}</p>
              <p className="text-sm font-medium text-[#2E1B12]">{foodNote}</p>
            </div>
          </div>

          {/* Evidence summary */}
          <div className="p-8 md:p-12 border-b border-[#2E1B12]/10">
            <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-4">{s.evidenceSummary}</p>
            <p className="text-sm text-[#2E1B12] leading-relaxed">{supplement.evidenceSummary}</p>
          </div>

          {/* Benefit chart */}
          <div className="p-8 md:p-12 border-b border-[#2E1B12]/10">
            <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-8">{s.benefitProfile}</p>
            <BenefitRadarChart goals={supplement.goals} evidenceLevel={supplement.evidenceLevel} />
          </div>

          {/* Caution note */}
          {supplement.cautionNote && (
            <div className="px-8 md:px-12 py-6 border-b border-[#2E1B12]/10">
              <div className="border-l-2 border-[#FFB326] pl-4">
                <p className="text-xs tracking-widest uppercase text-[#FFB326] mb-2">{s.importantNote}</p>
                <p className="text-sm text-[#9C8B78] leading-relaxed">{supplement.cautionNote}</p>
              </div>
            </div>
          )}

          {/* Interactions */}
          <div className="p-8 md:p-12 border-b border-[#2E1B12]/10">
            <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-6">{s.interactions}</p>
            {supplement.pairWith.length === 0 && supplement.avoidWith.length === 0 && supplement.separateFrom.length === 0
              ? <p className="text-sm text-[#9C8B78]">{s.noInteractions}</p>
              : (
                <div className="space-y-4">
                  {supplement.pairWith.length > 0 && (
                    <div className="space-y-3">
                      {supplement.pairWith.map((p, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <span className="text-xs tracking-widest uppercase text-[#4A7C59] flex-shrink-0 w-12 mt-0.5">{s.pair}</span>
                          <div>
                            <p className="text-sm font-medium text-[#2E1B12]">{p.item}</p>
                            <p className="text-xs text-[#9C8B78] mt-0.5">{p.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {supplement.separateFrom.length > 0 && (
                    <div className="space-y-3">
                      {supplement.separateFrom.map((p, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <span className="text-xs tracking-widest uppercase text-[#FFB326] flex-shrink-0 w-12 mt-0.5">{s.space}</span>
                          <div>
                            <p className="text-sm font-medium text-[#2E1B12]">
                              {p.item}{p.separationHours ? ` ${s.hoursApart(p.separationHours)}` : ""}
                            </p>
                            <p className="text-xs text-[#9C8B78] mt-0.5">{p.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {supplement.avoidWith.length > 0 && (
                    <div className="space-y-3">
                      {supplement.avoidWith.map((p, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <span className="text-xs tracking-widest uppercase text-red-400 flex-shrink-0 w-12 mt-0.5">{s.avoid}</span>
                          <div>
                            <p className="text-sm font-medium text-[#2E1B12]">{p.item}</p>
                            <p className="text-xs text-[#9C8B78] mt-0.5">{p.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
          </div>

          {/* Diet relevance */}
          {supplement.dietRelevance && (supplement.dietRelevance.vegetarian || supplement.dietRelevance.vegan) && (
            <div className="p-8 md:p-12 border-b border-[#2E1B12]/10">
              <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-4">{s.dietConsiderations}</p>
              <div className="space-y-3">
                {supplement.dietRelevance.vegetarian && (
                  <div className="flex items-start gap-4">
                    <span className="text-xs tracking-widest uppercase text-[#9C8B78] flex-shrink-0 w-20 mt-0.5">{s.vegetarian}</span>
                    <p className="text-sm text-[#9C8B78]">{supplement.dietRelevance.vegetarian}</p>
                  </div>
                )}
                {supplement.dietRelevance.vegan && (
                  <div className="flex items-start gap-4">
                    <span className="text-xs tracking-widest uppercase text-[#9C8B78] flex-shrink-0 w-20 mt-0.5">{s.vegan}</span>
                    <p className="text-sm text-[#9C8B78]">{supplement.dietRelevance.vegan}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Citations */}
          <div className="p-8 md:p-12">
            <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-6">{s.researchCitations}</p>
            <div className="space-y-4">
              {supplement.citations.map((citation, i) => {
                const isTmgl = citation.url.includes("search.tmgl.org");
                const pmidMatch = isTmgl ? citation.url.match(/mdl-(\d+)/) : null;
                const pubmedFallback = pmidMatch ? `https://pubmed.ncbi.nlm.nih.gov/${pmidMatch[1]}/` : null;
                return (
                  <div key={citation.id} className="flex items-baseline gap-4">
                    <span className="text-sm text-[#9C8B78] flex-shrink-0">{i + 1}</span>
                    <div>
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#2E1B12] hover:text-[#FFB326] transition-colors leading-snug"
                      >
                        {citation.title}
                      </a>
                      {citation.year && (
                        <span className="text-xs text-[#9C8B78] ml-2">({citation.year})</span>
                      )}
                      {isTmgl && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <span className="text-xs text-[#4A7C59] font-medium">WHO TMGL</span>
                          {pubmedFallback && (
                            <>
                              <span className="text-[#9C8B78] text-xs">·</span>
                              <a
                                href={pubmedFallback}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#9C8B78] hover:text-[#FFB326] transition-colors"
                              >
                                PubMed ↗
                              </a>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-[#9C8B78]">{s.eduOnly}</p>
          <Link href="/results" className="text-xs tracking-widest uppercase text-[#9C8B78] hover:text-[#2E1B12] transition-colors">
            {s.backToResults}
          </Link>
        </div>

      </div>
    </div>
  );
}
