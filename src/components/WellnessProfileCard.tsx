"use client";

import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { UserProfile } from "@/types";
import { getT } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

type WellnessScores = {
  energy: number;
  recovery: number;
  resilience: number;
  focus: number;
  vitality: number;
  longevity: number;
};

type WellnessT = ReturnType<typeof getT>["results"]["wellness"];

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

function peakDimension(scores: WellnessScores): keyof WellnessScores {
  return DIMENSIONS.reduce((a, b) => (scores[b] > scores[a] ? b : a));
}

/* --- Signature "route" radar: the shape people recognise as their profile --- */
function WellnessRadarChart({
  scores, progress, dimLabels, peak,
}: {
  scores: WellnessScores;
  progress: number;
  dimLabels: Record<string, string>;
  peak: keyof WellnessScores;
}) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.34;
  const labelR = size * 0.46;
  const n = DIMENSIONS.length;

  const angle = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const axisPoint = (i: number, s: number) => ({
    x: cx + maxR * s * Math.cos(angle(i)),
    y: cy + maxR * s * Math.sin(angle(i)),
  });
  const labelPoint = (i: number) => ({
    x: cx + labelR * Math.cos(angle(i)),
    y: cy + labelR * Math.sin(angle(i)),
  });
  const textAnchor = (i: number): "start" | "end" | "middle" => {
    const c = Math.cos(angle(i));
    return c > 0.3 ? "start" : c < -0.3 ? "end" : "middle";
  };
  const baseline = (i: number): "hanging" | "auto" | "middle" => {
    const s = Math.sin(angle(i));
    return s > 0.3 ? "hanging" : s < -0.3 ? "auto" : "middle";
  };

  const pts = DIMENSIONS.map((d, i) => axisPoint(i, Math.max((scores[d] / 100) * progress, 0.02)));
  const dataPath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") + " Z";
  const gridPath = (lvl: number) =>
    DIMENSIONS.map((_, i) => {
      const p = axisPoint(i, lvl);
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map((lvl, i) => (
        <path key={i} d={gridPath(lvl)} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={1} />
      ))}
      {DIMENSIONS.map((_, i) => {
        const o = axisPoint(i, 1);
        return (
          <line key={i} x1={cx} y1={cy} x2={o.x.toFixed(2)} y2={o.y.toFixed(2)}
            stroke="rgba(255,255,255,0.13)" strokeWidth={1} />
        );
      })}

      {/* soft glow behind the shape (flat strokes only, so html-to-image can rasterise it) */}
      <path d={dataPath} fill="none" stroke="rgba(255,179,38,0.28)" strokeWidth={11} strokeLinejoin="round" />
      {/* the shape */}
      <path d={dataPath} fill="rgba(255,179,38,0.14)" stroke="none" strokeLinejoin="round" />
      <path d={dataPath} fill="none" stroke="#FFB326" strokeWidth={2.5} strokeLinejoin="round" />

      {pts.map((p, i) => {
        const isPeak = DIMENSIONS[i] === peak;
        return (
          <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)}
            r={isPeak ? 5.5 : 3.5} fill="#FFB326"
            stroke={isPeak ? "rgba(255,179,38,0.3)" : "none"} strokeWidth={isPeak ? 6 : 0} />
        );
      })}

      {DIMENSIONS.map((d, i) => {
        const lp = labelPoint(i);
        return (
          <text key={d} x={lp.x.toFixed(2)} y={lp.y.toFixed(2)}
            textAnchor={textAnchor(i)} dominantBaseline={baseline(i)}
            fontSize={8.5} letterSpacing="0.12em" fontWeight={d === peak ? 600 : 400}
            fill={d === peak ? "#FFB326" : "rgba(252,252,247,0.9)"}
            fontFamily="ABCMonumentGrotesk, Arial, sans-serif">
            {(dimLabels[d] ?? DIM_LABELS[d]).toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

/* --- The card body, shared by the on-page version and the 1080x1920 export --- */
function CardBody({
  variant, archetypeName, tagline, chips, scores, overall, progress, w, onShare, shareLabel, shareDisabled,
}: {
  variant: "inline" | "export";
  archetypeName: string;
  tagline: string;
  chips: string[];
  scores: WellnessScores;
  overall: number;
  progress: number;
  w: WellnessT;
  onShare?: () => void;
  shareLabel?: string;
  shareDisabled?: boolean;
}) {
  const isExport = variant === "export";
  const peak = peakDimension(scores);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        minHeight: isExport ? 1920 : undefined,
        color: "#fff",
        fontFamily: "ABCMonumentGrotesk, Arial, sans-serif",
        fontSize: isExport ? 31 : "clamp(12.5px, 3.5vw, 16px)",
        padding: isExport ? "3.2em 2.7em 2.6em" : "1.1em 1.15em 1.2em",
      }}
    >
      {/* header group */}
      <div>
        <div
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.7em", marginBottom: "1.5em",
          }}
        >
          <span style={{ fontSize: "0.62em", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,179,38,0.85)" }}>
            {w.topbar}
          </span>
          <span style={{ fontSize: "0.62em", letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)" }}>2026</span>
        </div>

        <div style={{ fontSize: "0.6em", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,179,38,0.9)", marginBottom: "0.7em" }}>
          {w.yourArchetype}
        </div>
        <div style={{ fontSize: "2.55em", lineHeight: 1.02, letterSpacing: "-0.02em", color: "#FFB326", marginBottom: "0.42em" }}>
          {archetypeName}
        </div>
        <div
          style={{
            fontSize: "0.95em", lineHeight: 1.5, color: "rgba(255,255,255,0.85)", marginBottom: "1.15em",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}
        >
          {tagline}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5em" }}>
          {chips.map((c) => (
            <span
              key={c}
              style={{
                fontSize: "0.6em", letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.3)", padding: "0.5em 0.75em",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* centre group: signature radar + hero index */}
      <div
        style={{
          flex: isExport ? 1 : undefined,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: isExport ? "1.4em 0" : "1.8em 0 1.4em",
        }}
      >
        <div style={{ width: isExport ? "20em" : "16.5em", height: isExport ? "20em" : "16.5em" }}>
          <WellnessRadarChart scores={scores} progress={progress} dimLabels={w.dims} peak={peak} />
        </div>
        <div style={{ textAlign: "center", marginTop: isExport ? "1.5em" : "1.1em" }}>
          <div style={{ fontSize: "4.7em", fontWeight: 300, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {Math.round(overall * progress)}
          </div>
          <div style={{ fontSize: "0.6em", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: "0.85em" }}>
            {w.indexLabel}
          </div>
        </div>
      </div>

      {/* splits group: the six pillars, Strava-style */}
      <div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "1em", display: "flex", flexDirection: "column", gap: "0.6em" }}>
          {DIMENSIONS.map((d) => {
            const isPeak = d === peak;
            return (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: "0.8em" }}>
                <span
                  style={{
                    width: "6.6em", flexShrink: 0, fontSize: "0.62em", letterSpacing: "0.12em", textTransform: "uppercase",
                    color: isPeak ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {w.dims[d] ?? DIM_LABELS[d]}
                </span>
                <span style={{ flex: 1, height: "0.5em", background: "rgba(255,255,255,0.12)", position: "relative", overflow: "hidden" }}>
                  <span
                    style={{
                      position: "absolute", left: 0, top: 0, bottom: 0,
                      width: `${Math.max(scores[d] * progress, 0)}%`,
                      background: isPeak ? "#FFB326" : "rgba(255,179,38,0.7)",
                    }}
                  />
                </span>
                <span
                  style={{
                    width: "2.6em", flexShrink: 0, textAlign: "right", fontSize: "0.92em", fontVariantNumeric: "tabular-nums",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.28em",
                  }}
                >
                  {isPeak && <span style={{ color: "#FFB326", fontSize: "0.7em" }}>▲</span>}
                  {Math.round(scores[d] * progress)}
                </span>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: "1em", paddingTop: "1em",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1em",
          }}
        >
          <span style={{ fontSize: "0.6em", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            sproutlab.it
          </span>
          {isExport ? (
            <span style={{ fontSize: "0.62em", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,179,38,0.9)" }}>
              {w.cta} ↗
            </span>
          ) : (
            <button
              onClick={onShare}
              disabled={shareDisabled}
              style={{
                fontSize: "0.68em", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
                background: "#FFB326", color: "#2E1B12", borderRadius: "999px", padding: "0.95em 1.6em",
                border: "none", cursor: shareDisabled ? "default" : "pointer", opacity: shareDisabled ? 0.5 : 1,
              }}
            >
              {shareLabel}
            </button>
          )}
        </div>
      </div>
    </div>
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
  const exportRef = useRef<HTMLDivElement>(null);

  const w = getT(useLocale()).results.wellness;
  const scores = computeWellnessScores(profile);
  const archetype = getArchetype(profile);
  const archetypeTagline = w.taglines[archetype.name] ?? archetype.tagline;
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / DIMENSIONS.length);

  const [bgDataUrl, setBgDataUrl] = useState<string>(archetype.image);

  // Run the reveal animation only once the card scrolls into view.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
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
      { threshold: 0.3 },
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

  // Pre-load the archetype background as a data URL so html-to-image can embed it.
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
    const node = exportRef.current;
    if (!node || shareState === "generating") return;
    setShareState("generating");
    try {
      // html-to-image only rasterises the card content (text + SVG on a
      // transparent ground). The photo background and overlay are composited
      // separately on a canvas, since html-to-image is unreliable with
      // background images / object-fit.
      const cssHeight = node.offsetHeight || 1920;
      const withTimeout = <T,>(p: Promise<T>, ms: number) =>
        Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
      const cardBlob = await withTimeout(toBlob(node, { pixelRatio: 2 }), 12000);
      if (!cardBlob) throw new Error("capture failed");

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = src;
        });

      const cardUrl = URL.createObjectURL(cardBlob);
      const cardImg = await loadImage(cardUrl);
      const bgImg = await loadImage(bgDataUrl).catch(() => null);

      const W = 1080 * 2;
      const H = Math.round(cssHeight * 2);
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#14060a";
      ctx.fillRect(0, 0, W, H);

      if (bgImg) {
        const canvasRatio = W / H;
        const bgRatio = bgImg.width / bgImg.height;
        let sx = 0, sy = 0, sw = bgImg.width, sh = bgImg.height;
        if (bgRatio > canvasRatio) {
          sw = bgImg.height * canvasRatio;
          sx = (bgImg.width - sw) / 2;
        } else {
          sh = bgImg.width / canvasRatio;
          sy = (bgImg.height - sh) / 2;
        }
        ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, W, H);
      }

      ctx.fillStyle = "rgba(20,12,6,0.86)";
      ctx.fillRect(0, 0, W, H);

      ctx.drawImage(cardImg, 0, 0, W, H);

      // brand rule at the top
      ctx.fillStyle = "#FFB326";
      ctx.fillRect(0, 0, W, 6);

      URL.revokeObjectURL(cardUrl);

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas failed"))), "image/png"),
      );

      const file = new File([blob], "sprout-wellness-profile.png", { type: "image/png" });
      if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: archetype.name });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sprout-wellness-profile.png";
        a.click();
        URL.revokeObjectURL(url);
      }
      setShareState("done");
      setTimeout(() => setShareState("idle"), 2500);
    } catch {
      setShareState("idle");
    }
  };

  const shareLabel =
    shareState === "generating" ? w.sharing : shareState === "done" ? w.shared : w.share;

  const chips = [
    w.chipAge(profile.age),
    w.chipDiet[profile.diet] ?? profile.diet,
    profile.exerciseFrequency ? w.chipActivity[profile.exerciseFrequency] : null,
    profile.sleepHours ? w.chipSleep(profile.sleepHours) : null,
  ].filter(Boolean) as string[];

  return (
    <>
      {/* On-page card */}
      <div ref={cardRef} style={{ position: "relative", overflow: "hidden", borderTop: "2px solid #FFB326" }}>
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${bgDataUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(20,12,6,0.86)" }} />
        <CardBody
          variant="inline"
          archetypeName={archetype.name}
          tagline={archetypeTagline}
          chips={chips}
          scores={scores}
          overall={overall}
          progress={progress}
          w={w}
          onShare={handleShare}
          shareLabel={shareLabel}
          shareDisabled={shareState === "generating"}
        />
      </div>

      {/* 1080-wide target rasterised for the shareable export. Content only: the
          photo background is composited on canvas in handleShare. Kept on-screen
          at (0,0) so html-to-image measures it correctly, but fully transparent
          and click-through via the wrapper (opacity is not read on exportRef
          itself, so the capture is opaque). */}
      <div
        aria-hidden
        style={{
          position: "fixed", top: 0, left: 0, zIndex: -1,
          opacity: 0, pointerEvents: "none", overflow: "hidden",
          width: 1080, height: 1,
        }}
      >
        <div ref={exportRef} style={{ width: 1080 }}>
          <CardBody
            variant="export"
            archetypeName={archetype.name}
            tagline={archetypeTagline}
            chips={chips}
            scores={scores}
            overall={overall}
            progress={1}
            w={w}
          />
        </div>
      </div>
    </>
  );
}
