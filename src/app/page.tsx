import Link from "next/link";
import { headers } from "next/headers";
import { getT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default async function Home() {
  const headerStore = await headers();
  const locale = (headerStore.get("x-locale") ?? "en") as Locale;
  const t = getT(locale);
  const h = t.home;

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      <section className="flex-1 flex items-center justify-center px-6 pt-44 pb-32 relative min-h-[560px] overflow-hidden">
        {/* Background photo, blurred and scaled up slightly so the blur never reveals an edge */}
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(8px)",
          }}
        />
        {/* Dark brand-brown veil (not plain black) so white text stays reliably legible over the photo */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(46,27,18,0.72)" }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-normal text-white mb-6 leading-tight uppercase" style={{ letterSpacing: "-0.04em" }}>
            {h.hero.title[0]}<br />{h.hero.title[1]}
          </h1>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
            {h.hero.subtitle}
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center justify-between gap-8 px-8 py-4 bg-[#FFB326] text-[#2E1B12] rounded-full font-medium hover:bg-[#e6a020] transition-colors"
          >
            <span>{h.hero.cta}</span>
            <span>→</span>
          </Link>
          <p className="mt-5 text-sm text-white/60">
            {h.hero.meta}
          </p>
          <p className="mt-3 text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
            {h.hero.privacy}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-[#2E1B12]/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#2E1B12]/10">
            <FeatureItem label={h.features.schedule.label} description={h.features.schedule.desc} />
            <FeatureItem label={h.features.pairing.label} description={h.features.pairing.desc} />
            <FeatureItem label={h.features.evidence.label} description={h.features.evidence.desc} />
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-[#2E1B12]/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-normal text-[#2E1B12] mb-10 uppercase" style={{ letterSpacing: "-0.03em" }}>
            {h.howItWorks.title}
          </h2>
          <div className="space-y-0 divide-y divide-[#2E1B12]/10 text-left">
            {h.howItWorks.steps.map((step, i) => (
              <StepItem key={i} number={i + 1} title={step.title} description={step.desc} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/intake"
              className="inline-flex items-center justify-between gap-8 px-8 py-4 bg-[#FFB326] text-[#2E1B12] rounded-full font-medium hover:bg-[#e6a020] transition-colors"
            >
              <span>{h.howItWorks.cta}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 border-t border-[#2E1B12]/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[#9C8B78] mb-2">
            {h.methodology.built}
          </p>
          <Link href="/methodology" className="text-sm text-[#FFB326] hover:underline">
            {h.methodology.link}
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ label, description }: { label: string; description: string }) {
  return (
    <div className="py-8 md:py-0 md:px-8 first:pl-0 last:pr-0">
      <h3 className="text-lg font-medium text-[#2E1B12] mb-3">{label}</h3>
      <p className="text-base text-[#9C8B78] leading-relaxed">{description}</p>
    </div>
  );
}

function StepItem({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-6 py-8">
      <span className="text-sm text-[#9C8B78] w-5 flex-shrink-0 mt-1">{number}</span>
      <div>
        <h3 className="text-xl font-medium text-[#2E1B12] mb-2">{title}</h3>
        <p className="text-base text-[#9C8B78] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
