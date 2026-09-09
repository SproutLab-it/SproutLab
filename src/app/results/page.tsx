"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ScheduleView, WellnessProfileCard, useLocale } from "@/components";
import { generateRecommendations, groupBySchedule, SPROUT_PRODUCT_MATCH_SLUGS } from "@/lib/recommendation-engine";
import { UserProfile, ScheduleGroup, SupplementRecommendation } from "@/types";
import { getT } from "@/lib/i18n";
import { AMAZON_PRODUCTS } from "@/lib/amazon-products";

const INGREDIENT_LABEL_IT: Record<string, string> = {
  cordyceps: "Cordyceps", ashwagandha: "Ashwagandha", reishi: "Reishi",
  maca: "Maca", "lions-mane": "Lion's Mane", rhodiola: "Rodiola",
  magnesium: "Magnesio", "vitamin-b6": "Vitamina B6", zinc: "Zinco",
  turmeric: "Piperina (da Curcuma)", tremella: "Tremella", astaxanthin: "Astaxantina",
};

const SPROUTLAB_PRODUCTS = [
  {
    id: "mycofuel",
    name: "Mycofuel",
    tagline: "Energy, endurance & adaptogens",
    taglineIt: "Energia, resistenza e adattogeni",
    image: "/mycofuel.jpg",
    imageWidth: 897,
    imageHeight: 739,
    url: "https://sproutlab.it/shop/mycofuel/",
    matchSlugs: SPROUT_PRODUCT_MATCH_SLUGS.mycofuel,
    ingredientLabels: {
      cordyceps: "Cordyceps",
      ashwagandha: "Ashwagandha",
      reishi: "Reishi",
      maca: "Maca Root",
      "lions-mane": "Lion's Mane",
      rhodiola: "Rhodiola Rosea",
      magnesium: "Magnesium",
      "vitamin-b6": "Vitamin B6",
      zinc: "Zinc",
      turmeric: "Piperine (via Turmeric)",
    } as Record<string, string>,
  },
  {
    id: "mycoderm",
    name: "Mycoderm",
    tagline: "Skin health, cellular protection & glow",
    taglineIt: "Salute della pelle, protezione cellulare e luminosità",
    image: "/mycoderm.jpg",
    imageWidth: 897,
    imageHeight: 739,
    url: "https://sproutlab.it/shop/mycoderm/",
    matchSlugs: SPROUT_PRODUCT_MATCH_SLUGS.mycoderm,
    ingredientLabels: {
      tremella: "Tremella",
      cordyceps: "Cordyceps",
      reishi: "Reishi",
      "lions-mane": "Lion's Mane",
      astaxanthin: "Astaxanthin",
      magnesium: "Magnesium",
      zinc: "Zinc",
      "vitamin-b6": "Vitamin B6",
      turmeric: "Piperine (via Turmeric)",
    } as Record<string, string>,
  },
];

// Read the intake profile straight from sessionStorage during render instead of
// copying it into state inside an effect. useSyncExternalStore gives a stable,
// hydration-safe read: the server snapshot is null / not-mounted, the client
// swaps in the real values on the post-hydration re-render.
const noopSubscribe = () => () => {};
const readStoredProfile = () =>
  typeof window === "undefined" ? null : window.sessionStorage.getItem("intakeProfile");
const nullSnapshot = () => null;
const trueSnapshot = () => true;
const falseSnapshot = () => false;

export default function ResultsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = getT(locale);
  const tr = t.results;

  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // false during SSR and the first (hydration) client render, true afterwards.
  const mounted = useSyncExternalStore(noopSubscribe, trueSnapshot, falseSnapshot);
  const storedProfile = useSyncExternalStore(noopSubscribe, readStoredProfile, nullSnapshot);

  const profile = useMemo<UserProfile | null>(() => {
    if (!storedProfile) return null;
    try {
      return JSON.parse(storedProfile) as UserProfile;
    } catch {
      return null;
    }
  }, [storedProfile]);

  const recommendations = useMemo<SupplementRecommendation[]>(
    () => (profile ? generateRecommendations(profile, locale) : []),
    [profile, locale],
  );
  const schedule = useMemo<ScheduleGroup[]>(
    () => groupBySchedule(recommendations),
    [recommendations],
  );

  // Redirect back to the questionnaire when there is no usable stored profile.
  // Gated on `mounted` so it only runs once the client snapshot is in, never
  // during SSR/hydration when `storedProfile` is still the null server snapshot.
  useEffect(() => {
    if (mounted && !profile) router.push("/intake");
  }, [mounted, profile, router]);

  if (!mounted || !profile) {
    return (
      <div className="grow bg-[#FCFCF7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-6 h-6 border-2 border-[#FFB326] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-[#9C8B78] tracking-wide">{tr.loading}</p>
        </div>
      </div>
    );
  }

  const highEvidence = recommendations.filter((r) => r.evidenceLevel === "high").length;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !profile || emailState === "sending") return;
    setEmailState("sending");
    try {
      const res = await fetch("/api/send-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), profile, locale }),
      });
      setEmailState(res.ok ? "sent" : "error");
    } catch {
      setEmailState("error");
    }
  };

  const recommendedSlugs = recommendations.map((r) => r.slug);
  const matchedProducts = SPROUTLAB_PRODUCTS.map((product) => {
    const matched = product.matchSlugs.filter((s) => recommendedSlugs.includes(s));
    return { ...product, matched };
  }).filter((p) => p.matched.length >= 2);

  const allSproutSlugs = new Set(SPROUTLAB_PRODUCTS.flatMap((p) => p.matchSlugs));
  const amazonSuggestions = recommendations.filter(
    (r) => !allSproutSlugs.has(r.slug) && AMAZON_PRODUCTS[r.slug]
  );

  return (
    <div className="grow bg-[#FCFCF7] pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <Link href="/intake" className="text-xs tracking-widest uppercase text-[#9C8B78] hover:text-[#2E1B12] transition-colors">
            {tr.retake}
          </Link>
        </div>

        {/* Hero header */}
        <div className="bg-white border border-[#2E1B12]/10 p-8 md:p-12 mb-px">
          <p className="text-xs tracking-widest uppercase text-[#9C8B78] mb-3">{tr.tagline}</p>
          <h1 className="text-3xl md:text-5xl font-normal text-[#2E1B12] mb-4 leading-tight">
            {tr.title[0]}<br />{tr.title[1]}
          </h1>

          {/* Email CTA */}
          <div className="mt-8 pt-8 border-t border-[#2E1B12]/10">
            {emailState === "sent" ? (
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB326] flex-shrink-0" />
                <p className="text-sm text-[#2E1B12]">
                  {tr.email.sentPrefix} <span className="font-medium">{email}</span>{tr.email.sentSuffix}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#2E1B12] mb-1">{tr.email.cta}</p>
                <p className="text-xs text-[#9C8B78] mb-4">{tr.email.hint}</p>
                {emailState === "error" && (
                  <p className="text-xs text-[#B4441F] mb-3">{tr.email.error}</p>
                )}
                <form onSubmit={handleEmailSubmit} className="flex gap-2 flex-wrap">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0 border border-[#2E1B12]/20 bg-transparent px-4 py-2.5 text-sm text-[#2E1B12] placeholder:text-[#9C8B78] outline-none focus:border-[#2E1B12]/60 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={emailState === "sending"}
                    className="px-6 py-2.5 bg-[#FFB326] text-[#2E1B12] text-sm font-medium hover:bg-[#e6a020] transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    {emailState === "sending" ? tr.email.sending : tr.email.send}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-white border border-[#2E1B12]/10 border-t-0 grid grid-cols-3 divide-x divide-[#2E1B12]/10 mb-4">
          <div className="p-6 text-center">
            <div className="text-3xl font-normal text-[#FFB326] mb-1">{recommendations.length}</div>
            <div className="text-xs tracking-widest uppercase text-[#9C8B78]">{tr.stats.supplements}</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-normal text-[#FFB326] mb-1">{schedule.length}</div>
            <div className="text-xs tracking-widest uppercase text-[#9C8B78]">{tr.stats.timeSlots}</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-normal text-[#FFB326] mb-1">{highEvidence}</div>
            <div className="text-xs tracking-widest uppercase text-[#9C8B78]">{tr.stats.highEvidence}</div>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="bg-white border border-[#2E1B12]/10 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2E1B12] mb-8">{tr.schedule.title}</h2>
          <ScheduleView schedule={schedule} />
        </div>

        {/* Sprout Lab product recommendations */}
        {matchedProducts.length > 0 && (
          <div className="bg-[#2E1B12] mt-4 p-8 md:p-12">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="text-xs tracking-widest uppercase text-[#FFB326] mb-2">{tr.sprout.subtitle}</p>
                <p className="text-2xl md:text-3xl font-normal text-[#FCFCF7] leading-tight">
                  {tr.sprout.title[0]}<br />{tr.sprout.title[1]}
                </p>
              </div>
              <span className="hidden md:block text-xs tracking-widest uppercase text-[#FCFCF7]/30 mt-1">
                {matchedProducts.length} {tr.sprout.matchSuffix(matchedProducts.length)}
              </span>
            </div>

            {matchedProducts.length === 1 ? (
              <div className="bg-[#FCFCF7]/5 flex flex-col sm:flex-row overflow-hidden">
                <div className="relative aspect-[4/3] sm:aspect-auto sm:w-5/12 flex-shrink-0 overflow-hidden">
                  <Image
                    src={matchedProducts[0].image}
                    alt={matchedProducts[0].name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, 42vw"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 p-8 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-medium text-[#FCFCF7] leading-snug">{matchedProducts[0].name}</p>
                      <p className="text-xs text-[#FCFCF7]/50 mt-0.5">{locale === "it" ? matchedProducts[0].taglineIt : matchedProducts[0].tagline}</p>
                      <p className="text-xs text-[#FFB326] mt-3">{tr.sprout.includes(matchedProducts[0].matched.length)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {matchedProducts[0].matched.map((slug) => (
                        <span key={slug} className="text-xs border border-[#FFB326]/30 text-[#FFB326] px-2.5 py-1">
                          {locale === "it" ? (INGREDIENT_LABEL_IT[slug] ?? matchedProducts[0].ingredientLabels[slug]) : matchedProducts[0].ingredientLabels[slug]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={matchedProducts[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-between border border-[#FCFCF7]/20 px-5 py-3 text-sm text-[#FCFCF7] hover:border-[#FFB326] hover:text-[#FFB326] transition-colors"
                  >
                    <span>{tr.sprout.shop(matchedProducts[0].name)}</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid gap-px md:grid-cols-2">
                {matchedProducts.map((product) => (
                  <div key={product.id} className="bg-[#FCFCF7]/5 flex flex-col gap-5">
                    <div className="w-full overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={product.imageWidth}
                        height={product.imageHeight}
                        className="w-full h-auto"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="px-6 pb-0">
                      <p className="text-lg font-medium text-[#FCFCF7] leading-snug">{product.name}</p>
                      <p className="text-xs text-[#FCFCF7]/50 mt-0.5">{locale === "it" ? product.taglineIt : product.tagline}</p>
                      <p className="text-xs text-[#FFB326] mt-2">{tr.sprout.includes(product.matched.length)}</p>
                    </div>
                    <div className="px-6 flex flex-wrap gap-2">
                      {product.matched.map((slug) => (
                        <span key={slug} className="text-xs border border-[#FFB326]/30 text-[#FFB326] px-2.5 py-1">
                          {locale === "it" ? (INGREDIENT_LABEL_IT[slug] ?? product.ingredientLabels[slug]) : product.ingredientLabels[slug]}
                        </span>
                      ))}
                    </div>
                    <div className="px-6 pb-6 mt-auto">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-between border border-[#FCFCF7]/20 px-5 py-3 text-sm text-[#FCFCF7] hover:border-[#FFB326] hover:text-[#FFB326] transition-colors"
                      >
                        <span>{tr.sprout.shop(product.name)}</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-[#FCFCF7]/25 mt-6">
              {tr.sprout.disclaimer}
            </p>
          </div>
        )}

        {/* Amazon product suggestions */}
        {amazonSuggestions.length > 0 && (
          <div className="bg-[#2E1B12] mt-4 p-8 md:p-12">
            <div className="mb-6">
              <p className="text-2xl md:text-3xl font-normal text-[#FCFCF7]">{tr.amazon.title}</p>
            </div>

            <div className={`grid gap-px bg-[#FCFCF7]/10 ${amazonSuggestions.length === 1 ? "grid-cols-1" : amazonSuggestions.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}`}>
              {amazonSuggestions.map((rec) => {
                const product = AMAZON_PRODUCTS[rec.slug];
                return (
                  <a
                    key={rec.slug}
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#FCFCF7]/5 p-5 flex flex-col gap-2 group hover:bg-[#FCFCF7]/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-[#FCFCF7] leading-snug group-hover:text-[#FFB326] transition-colors">
                        {rec.name}
                      </p>
                      <span className="text-[#FCFCF7]/40 text-xs flex-shrink-0 mt-0.5 group-hover:text-[#FFB326] transition-colors">↗</span>
                    </div>
                    <p className="text-xs text-[#FCFCF7]/60">{product.brand}</p>
                    <p className="text-xs text-[#FCFCF7]/40 leading-relaxed">{locale === "it" ? product.shortDescIt : product.shortDesc}</p>
                  </a>
                );
              })}
            </div>

            <p className="text-xs text-[#FCFCF7]/30 mt-4">
              {tr.amazon.disclaimer}
            </p>
          </div>
        )}

        {/* Wellness Profile Card */}
        {profile && (
          <div className="mt-4">
            <WellnessProfileCard profile={profile} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex items-center justify-between">
          <Link href="/methodology" className="text-xs tracking-widest uppercase text-[#9C8B78] hover:text-[#2E1B12] transition-colors">
            {tr.footer.methodology}
          </Link>
          <Link
            href="/intake"
            className="inline-flex items-center gap-4 px-6 py-3 border border-[#2E1B12]/20 text-sm text-[#2E1B12] hover:border-[#2E1B12] transition-colors"
          >
            {tr.footer.retake}
          </Link>
        </div>

      </div>
    </div>
  );
}
