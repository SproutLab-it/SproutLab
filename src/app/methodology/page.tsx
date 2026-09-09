import Link from "next/link";
import { headers } from "next/headers";
import { getT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export const metadata = {
  title: "Methodology | Sprout",
  description:
    "Learn how Sprout creates evidence-based supplement recommendations using peer-reviewed research.",
};

export default async function MethodologyPage() {
  const headerStore = await headers();
  const locale = (headerStore.get("x-locale") ?? "en") as Locale;
  const t = getT(locale);
  const m = t.methodology;

  return (
    <div className="grow bg-[#FCFCF7] py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <Link href="/" className="text-xs tracking-widest uppercase text-[#9C8B78] hover:text-[#2E1B12] transition-colors">
            {m.back}
          </Link>
        </div>

        <div className="bg-white border border-[#2E1B12]/10">

          {/* Header */}
          <div className="p-8 md:p-12 border-b border-[#2E1B12]/10">
            <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-3">{m.tagline}</p>
            <h1 className="text-3xl md:text-4xl font-normal text-[#2E1B12] mb-4">
              {m.title}
            </h1>
            <p className="text-[#9C8B78] leading-relaxed">{m.subtitle}</p>
          </div>

          {/* Evidence Levels */}
          <section className="p-8 md:p-12 border-b border-[#2E1B12]/10">
            <h2 className="text-xs tracking-widest uppercase text-[#9C8B78] mb-6">{m.evidenceLevels.title}</h2>
            <p className="text-sm text-[#2E1B12] mb-8 leading-relaxed">{m.evidenceLevels.intro}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border-t-2 border-[#4A7C59] pt-4">
                <p className="text-xs tracking-widest uppercase text-[#4A7C59] mb-2">{m.evidenceLevels.high.label}</p>
                <p className="text-sm font-medium text-[#2E1B12] mb-2">{m.evidenceLevels.high.title}</p>
                <p className="text-sm text-[#9C8B78] leading-relaxed">{m.evidenceLevels.high.desc}</p>
              </div>
              <div className="border-t-2 border-[#FFB326] pt-4">
                <p className="text-xs tracking-widest uppercase text-[#FFB326] mb-2">{m.evidenceLevels.moderate.label}</p>
                <p className="text-sm font-medium text-[#2E1B12] mb-2">{m.evidenceLevels.moderate.title}</p>
                <p className="text-sm text-[#9C8B78] leading-relaxed">{m.evidenceLevels.moderate.desc}</p>
              </div>
              <div className="border-t-2 border-[#2E1B12]/20 pt-4">
                <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-2">{m.evidenceLevels.low.label}</p>
                <p className="text-sm font-medium text-[#2E1B12] mb-2">{m.evidenceLevels.low.title}</p>
                <p className="text-sm text-[#9C8B78] leading-relaxed">{m.evidenceLevels.low.desc}</p>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section className="p-8 md:p-12 border-b border-[#2E1B12]/10">
            <h2 className="text-xs tracking-widest uppercase text-[#9C8B78] mb-6">{m.dataSources.title}</h2>
            <p className="text-sm text-[#2E1B12] mb-6 leading-relaxed">{m.dataSources.intro}</p>
            <div className="space-y-0 divide-y divide-[#2E1B12]/10">
              {m.dataSources.sources.map((source) => (
                <div key={source.name} className="flex items-start gap-4 py-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB326] flex-shrink-0 mt-2" />
                  <div>
                    <span className="text-sm font-medium text-[#2E1B12]">{source.name}</span>
                    <span className="text-sm text-[#9C8B78]">: {source.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendation Engine */}
          <section className="p-8 md:p-12 border-b border-[#2E1B12]/10">
            <h2 className="text-xs tracking-widest uppercase text-[#9C8B78] mb-6">{m.engine.title}</h2>
            <p className="text-sm text-[#2E1B12] mb-6 leading-relaxed">{m.engine.intro}</p>
            <div className="space-y-0 divide-y divide-[#2E1B12]/10">
              {m.engine.steps.map((step) => (
                <div key={step.n} className="flex items-start gap-6 py-5">
                  <span className="text-xs text-[#9C8B78] w-4 flex-shrink-0 mt-0.5">{step.n}</span>
                  <div>
                    <h3 className="text-sm font-medium text-[#2E1B12] mb-1">{step.title}</h3>
                    <p className="text-sm text-[#9C8B78] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Limitations */}
          <section className="p-8 md:p-12 border-b border-[#2E1B12]/10">
            <h2 className="text-xs tracking-widest uppercase text-[#9C8B78] mb-6">{m.limitations.title}</h2>
            <div className="space-y-0 divide-y divide-[#2E1B12]/10">
              {m.limitations.items.map((item) => (
                <div key={item.title} className="flex items-start gap-4 py-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E1B12]/30 flex-shrink-0 mt-2" />
                  <p className="text-sm text-[#9C8B78] leading-relaxed">
                    <strong className="text-[#2E1B12] font-medium">{item.title}. </strong>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Safety */}
          <section className="p-8 md:p-12">
            <h2 className="text-xs tracking-widest uppercase text-[#9C8B78] mb-6">{m.safety.title}</h2>
            <div className="border border-[#2E1B12]/10 bg-[#FCFCF7] p-6">
              <p className="text-sm font-medium text-[#2E1B12] mb-4">{m.safety.header}</p>
              <div className="space-y-3">
                {m.safety.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB326] flex-shrink-0 mt-1.5" />
                    <p className="text-sm text-[#9C8B78] leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/intake"
            className="inline-flex items-center justify-between gap-8 px-8 py-4 bg-[#FFB326] text-[#2E1B12] rounded-full font-medium hover:bg-[#e6a020] transition-colors"
          >
            <span>{m.cta}</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
