"use client";

import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { UserProfile } from "@/types";

type WellnessScores = {
  energy: number;
  recovery: number;
  resilience: number;
  focus: number;
  vitality: number;
  longevity: number;
};

const DIMENSIONS: (keyof WellnessScores)[] = [
  "energy", "recovery", "resilience", "focus", "vitality", "longevity",
];

const DIM_LABELS: Record<keyof WellnessScores, string> = {
  energy: "Energy",
  recovery: "Recovery",
  resilience: "Resilience",
  focus: "Focus",
  vitality: "Vitality",
  longevity: "Longevity",
};

function computeWellnessScores(profile: UserProfile): WellnessScores {
  const clamp = (v: number) => Math.min(95, Math.max(20, Math.round(v)));
  let energy = 50, recovery = 50, resilience = 50, focus = 50, vitality = 50, longevity = 50;

  if (profile.sleepHours !== undefined) {
    const d = profile.sleepHours >= 8 ? 15 : profile.sleepHours >= 7 ? 8 : profile.sleepHours < 6 ? -20 : -8;
    energy += d; recovery += d * 0.8;
  }
  if (profile.sleepQuality === "excellent") { energy += 12; recovery += 25; focus += 15; resilience += 8; }
  else if (profile.sleepQuality === "good")  { energy += 6;  recovery += 12; focus += 8;  resilience += 8; }
  else if (profile.sleepQuality === "fair")  { energy -= 5;  recovery -= 5;  focus -= 5; }
  else if (profile.sleepQuality === "poor")  { energy -= 15; recovery -= 20; focus -= 15; resilience -= 8; }

  if (profile.exerciseFrequency === "intense")     { energy += 10; recovery += 5;  resilience += 10; focus += 8;  longevity += 18; }
  else if (profile.exerciseFrequency === "moderate") { energy += 8; recovery += 8; resilience += 10; focus += 8; longevity += 22; }
  else if (profile.exerciseFrequency === "light")    { longevity += 10; }
  else if (profile.exerciseFrequency === "sedentary") { energy -= 12; longevity -= 18; }

  if (profile.stressLevel === "high")     { energy -= 10; recovery -= 18; resilience -= 25; focus -= 15; longevity -= 12; }
  else if (profile.stressLevel === "low") { energy += 8;  recovery += 12; resilience += 25; focus += 10; longevity += 10; }

  if (profile.jobStress === "high") resilience -= 15;
  else if (profile.jobStress === "low") resilience += 12;

  if (profile.caffeineIntake === "moderate") { energy += 5;  focus += 10; }
  else if (profile.caffeineIntake === "high") { energy -= 8; focus += 2; }
  else if (profile.caffeineIntake === "low")  { focus -= 5; }

  if (profile.jobType === "desk") focus += 3;

  const dietVitality: Record<string, number> = {
    mediterranean: 22, vegan: 15, vegetarian: 12, paleo: 8,
    omnivore: 5, keto: 5, pescatarian: 7, "gluten-free": 3, carnivore: -5,
  };
  const dietLongevity: Record<string, number> = {
    mediterranean: 20, vegan: 15, vegetarian: 10, pescatarian: 8,
    paleo: 5, omnivore: 3, keto: 2, "gluten-free": 0, carnivore: -8,
  };
  vitality += dietVitality[profile.diet] || 0;
  longevity += dietLongevity[profile.diet] || 0;

  if (profile.sunExposure === "moderate") { vitality += 12; longevity += 5; }
  else if (profile.sunExposure === "high") vitality += 8;
  else if (profile.sunExposure === "low")  vitality -= 10;

  if (profile.digestiveIssues?.includes("none")) vitality += 10;
  else if (profile.digestiveIssues && profile.digestiveIssues.length > 0 && !profile.digestiveIssues.includes("none")) vitality -= 10;

  if (profile.medicalConditions && !profile.medicalConditions.includes("none") && profile.medicalConditions.length > 0) vitality -= 8;

  if (profile.sleepHours !== undefined) {
    if (profile.sleepHours >= 7) longevity += 8;
    else if (profile.sleepHours < 6) longevity -= 12;
  }

  return {
    energy: clamp(energy),
    recovery: clamp(recovery),
    resilience: clamp(resilience),
    focus: clamp(focus),
    vitality: clamp(vitality),
    longevity: clamp(longevity),
  };
}

function getArchetype(profile: UserProfile): { name: string; tagline: string; image: string } {
  const goals = new Set(profile.goals);
  const isHighStress = profile.stressLevel === "high" || profile.jobStress === "high";
  const isAthlete = profile.exerciseFrequency === "intense" || profile.exerciseIntensity?.includes("strength");

  if (goals.has("muscle") && isAthlete)
    return { name: "THE IRON PROTOCOL", tagline: "Built for performance. Engineered to recover.", image: "/archetypes/iron-protocol.jpg" };
  if (goals.has("focus") && profile.caffeineIntake === "high")
    return { name: "THE WIRED OPTIMIZER", tagline: "Caffeine runs the engine. Now let's tune it.", image: "/archetypes/wired-optimizer.jpg" };
  if (goals.has("sleep") && (profile.sleepQuality === "poor" || (profile.sleepHours !== undefined && profile.sleepHours < 6)))
    return { name: "THE SLEEP DEBT PROJECT", tagline: "Recovery is where the real gains happen.", image: "/archetypes/sleep-debt-project.jpg" };
  if (goals.has("longevity") && !isHighStress)
    return { name: "THE LONGEVITY PLAY", tagline: "Not just living longer, living better.", image: "/archetypes/longevity-play.jpg" };
  if (isHighStress || goals.has("stress"))
    return { name: "THE BURNOUT ANTIDOTE", tagline: "High pressure meets high resilience.", image: "/archetypes/burnout-antidote.jpg" };
  if (goals.has("skin"))
    return { name: "THE GLOW PROTOCOL", tagline: "Inside-out radiance. Evidence-backed.", image: "/archetypes/glow-protocol.jpg" };
  if (goals.has("immunity"))
    return { name: "THE DEFENSE SYSTEM", tagline: "Your body's first line of defense, optimized.", image: "/archetypes/defense-system.jpg" };
  if (goals.has("energy"))
    return { name: "THE ENERGY BLUEPRINT", tagline: "Sustainable fuel. No crash required.", image: "/archetypes/energy-blueprint.jpg" };
  return { name: "THE COMPLETE PROTOCOL", tagline: "Whole-system optimization. Nothing left behind.", image: "/archetypes/complete-protocol.jpg" };
}

function generateInsights(profile: UserProfile, scores: WellnessScores): string[] {
  const out: string[] = [];

  if (profile.caffeineIntake === "high" && (profile.sleepQuality === "poor" || profile.sleepQuality === "fair"))
    out.push("High caffeine is likely disrupting your sleep, a cycle your stack helps break");
  if (profile.stressLevel === "high" && profile.sleepQuality !== "excellent" && profile.sleepQuality !== "good")
    out.push("Your stress load is outpacing your recovery window");
  if (profile.sunExposure === "low")
    out.push("Low sun exposure makes D3 critical. Most indoor-living people are quietly deficient");
  if (profile.diet === "vegan" || profile.diet === "vegetarian")
    out.push("Plant-based diet means B12 depletes silently. Supplementing is non-negotiable");
  if (profile.exerciseFrequency === "sedentary")
    out.push("20 min of daily movement would shift your longevity score more than any supplement");
  if (profile.sleepHours !== undefined && profile.sleepHours < 6)
    out.push("Under 6h sleep accelerates cognitive decline. Your stack prioritizes this gap");

  const sorted = (Object.entries(scores) as [keyof WellnessScores, number][]).sort((a, b) => b[1] - a[1]);
  const [strongest] = sorted;
  const weakest = sorted[sorted.length - 1];

  if (out.length < 2)
    out.push(`Strongest pillar: ${DIM_LABELS[strongest[0]]} (${strongest[1]}). Your plan reinforces this`);
  if (out.length < 3)
    out.push(`Biggest lever: ${DIM_LABELS[weakest[0]]} (${weakest[1]}). Targeted support in your stack`);

  return out.slice(0, 3);
}

function WellnessRadarChart({ scores, progress, size = 240 }: { scores: WellnessScores; progress: number; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.325;
  const labelR = size * 0.442;
  const n = DIMENSIONS.length;

  const angle = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2;

  const axisPoint = (i: number, scale: number) => ({
    x: cx + maxR * scale * Math.cos(angle(i)),
    y: cy + maxR * scale * Math.sin(angle(i)),
  });

  const labelPoint = (i: number) => ({
    x: cx + labelR * Math.cos(angle(i)),
    y: cy + labelR * Math.sin(angle(i)),
  });

  const textAnchor = (i: number): "start" | "end" | "middle" => {
    const cos = Math.cos(angle(i));
    return cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
  };

  const dominantBaseline = (i: number): "hanging" | "auto" | "middle" => {
    const sin = Math.sin(angle(i));
    return sin > 0.3 ? "hanging" : sin < -0.3 ? "auto" : "middle";
  };

  const pts = DIMENSIONS.map((dim, i) => axisPoint(i, Math.max((scores[dim] / 100) * progress, 0.02)));
  const dataPath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") + " Z";
  const gridPath = (level: number) =>
    DIMENSIONS.map((_, i) => {
      const p = axisPoint(i, level);
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" className="overflow-visible">
      {[0.25, 0.5, 0.75, 1.0].map((lvl, i) => (
        <path key={i} d={gridPath(lvl)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      ))}
      {DIMENSIONS.map((_, i) => {
        const outer = axisPoint(i, 1);
        return (
          <line key={i} x1={cx} y1={cy} x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        );
      })}
      <path d={dataPath} fill="rgba(255,179,38,0.15)" stroke="#FFB326" strokeWidth={2} strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r={4} fill="#FFB326" />
      ))}
      {DIMENSIONS.map((dim, i) => {
        const lp = labelPoint(i);
        return (
          <text key={dim} x={lp.x.toFixed(2)} y={lp.y.toFixed(2)}
            textAnchor={textAnchor(i)} dominantBaseline={dominantBaseline(i)}
            fontSize={8} letterSpacing="0.1em" fill="rgba(252,252,247,0.92)"
            fontFamily="ABCMonumentGrotesk, Arial, sans-serif">
            {DIM_LABELS[dim].toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

interface WellnessProfileCardProps {
  profile: UserProfile;
}

export function WellnessProfileCard({ profile }: WellnessProfileCardProps) {
  const [progress, setProgress] = useState(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "generating" | "done">("idle");
  const cardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const scores = computeWellnessScores(profile);
  const archetype = getArchetype(profile);
  const insights = generateInsights(profile, scores);
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / DIMENSIONS.length);

  const [bgDataUrl, setBgDataUrl] = useState<string>(archetype.image);

  // Wait until the card scrolls into view before running the reveal animation,
  // so the radar/scores animate in when the user actually reaches this screen.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Very old browsers: skip the scroll-reveal gate rather than getting stuck at 0.
      setHasEnteredView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredView) return;
    let start: number | null = null;
    const raf = requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 900, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [hasEnteredView]);

  // Pre-load the archetype background as base64 so html-to-image can embed it in the capture
  useEffect(() => {
    setBgDataUrl(archetype.image);
    fetch(archetype.image)
      .then((r) => r.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => setBgDataUrl(reader.result as string);
        reader.readAsDataURL(blob);
      })
      .catch(() => {});
  }, [archetype.image]);

  const handleShare = async () => {
    if (!cardRef.current || shareState === "generating") return;
    setShareState("generating");
    try {
      // Hide elements that html-to-image struggles with, so we draw them manually on canvas
      if (footerRef.current) footerRef.current.style.display = "none";
      if (bgImgRef.current) bgImgRef.current.style.visibility = "hidden";
      if (overlayRef.current) overlayRef.current.style.visibility = "hidden";

      const cardBlob = await toBlob(cardRef.current, { pixelRatio: 2 });

      if (footerRef.current) footerRef.current.style.display = "";
      if (bgImgRef.current) bgImgRef.current.style.visibility = "";
      if (overlayRef.current) overlayRef.current.style.visibility = "";
      if (!cardBlob) throw new Error("capture failed");

      // Load the card capture
      const cardImg = new Image();
      const cardUrl = URL.createObjectURL(cardBlob);
      await new Promise<void>((res) => { cardImg.onload = () => res(); cardImg.src = cardUrl; });

      // Load the background image directly (already a base64 data URL)
      const bgImg = new Image();
      await new Promise<void>((res, rej) => {
        bgImg.onload = () => res();
        bgImg.onerror = rej;
        bgImg.src = bgDataUrl;
      });

      const W = 1080, H = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Base fill
      ctx.fillStyle = "#14060a";
      ctx.fillRect(0, 0, W, H);

      // Draw background image with cover-crop
      const bgRatio = bgImg.width / bgImg.height;
      const canvasRatio = W / H;
      let sx = 0, sy = 0, sw = bgImg.width, sh = bgImg.height;
      if (bgRatio > canvasRatio) {
        sw = bgImg.height * canvasRatio;
        sx = (bgImg.width - sw) / 2;
      } else {
        sh = bgImg.width / canvasRatio;
        sy = (bgImg.height - sh) / 2;
      }
      ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, W, H);

      // Dark overlay
      ctx.fillStyle = "rgba(20,12,6,0.82)";
      ctx.fillRect(0, 0, W, H);

      // Composite card content centered
      const padding = 60;
      const scale = (W - padding * 2) / cardImg.width;
      const dw = cardImg.width * scale;
      const dh = cardImg.height * scale;
      ctx.drawImage(cardImg, (W - dw) / 2, (H - dh) / 2, dw, dh);
      URL.revokeObjectURL(cardUrl);

      const storyBlob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error("canvas failed")), "image/png")
      );

      const file = new File([storyBlob], "sprout-wellness-profile.png", { type: "image/png" });
      if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: archetype.name });
      } else {
        const url = URL.createObjectURL(storyBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sprout-wellness-profile.png";
        a.click();
        URL.revokeObjectURL(url);
      }
      setShareState("done");
      setTimeout(() => setShareState("idle"), 2500);
    } catch {
      if (footerRef.current) footerRef.current.style.display = "";
      if (bgImgRef.current) bgImgRef.current.style.visibility = "";
      if (overlayRef.current) overlayRef.current.style.visibility = "";
      setShareState("idle");
    }
  };

  const chips = [
    `${profile.age}y`,
    profile.diet,
    profile.exerciseFrequency
      ? ({ sedentary: "sedentary", light: "light activity", moderate: "active", intense: "athlete" })[profile.exerciseFrequency]
      : null,
    profile.sleepHours ? `${profile.sleepHours}h sleep` : null,
  ].filter(Boolean) as string[];

  return (
    <div
      ref={cardRef}
      className="overflow-hidden relative"
      style={{ borderTop: "2px solid #FFB326" }}
    >
      {/* Background image */}
      <img
        ref={bgImgRef}
        src={bgDataUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        style={{ zIndex: 0 }}
      />
      {/* Dark overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "rgba(20,12,6,0.82)", zIndex: 1 }}
      />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
      {/* Top bar */}
      <div className="border-b border-white/[0.08] px-4 md:px-8 py-3 flex items-center justify-between">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#FFB326]/80">Sprout · Wellness Profile</p>
        <p className="text-[10px] tracking-widest text-white/40">2026</p>
      </div>

      <div className="px-4 md:px-12 pt-4 md:pt-6 pb-6 md:pb-10">
        {/* Archetype block, left aligned, near the top */}
        <div className="mb-6 md:mb-10">
          <p className="text-[9px] tracking-[0.2em] uppercase text-[#FFB326]/90 mb-1.5 md:mb-3">Your archetype</p>
          <h2 className="text-lg md:text-[38px] font-normal text-[#FFB326] leading-tight mb-1.5 md:mb-3 tracking-tight">
            {archetype.name}
          </h2>
          <p className="text-xs md:text-sm text-white/85 mb-3 md:mb-5 leading-relaxed">{archetype.tagline}</p>

          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span key={chip} className="text-[9px] tracking-[0.1em] uppercase text-white/80 border border-white/30 px-2 py-1">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Radar + overall score, centered */}
        <div className="flex flex-col items-center gap-1 mb-4 md:mb-6">
          <div className="w-[230px] h-[230px] md:w-[320px] md:h-[320px]">
            <WellnessRadarChart scores={scores} progress={progress} size={240} />
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-[46px] font-light text-white leading-none tabular-nums">
              {Math.round(overall * progress)}
            </p>
            <p className="text-[8px] tracking-[0.24em] uppercase text-white/40 mt-1">Overall</p>
          </div>
        </div>

        {/* Footer */}
        <div ref={footerRef} className="mt-5 md:mt-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/40">sproutlab.it</p>
          <button
            onClick={handleShare}
            disabled={shareState === "generating"}
            className="text-[10px] md:text-xs font-medium tracking-[0.16em] uppercase bg-[#FFB326] text-[#2E1B12] rounded-full px-5 py-2.5 md:px-6 md:py-3 shadow-lg shadow-[#FFB326]/25 hover:bg-[#e6a020] transition-colors disabled:opacity-50"
          >
            {shareState === "generating" ? "Generating…" : shareState === "done" ? "Saved ✓" : "Share your profile ↗"}
          </button>
        </div>
      </div>
      </div> {/* end content wrapper */}
    </div>
  );
}
