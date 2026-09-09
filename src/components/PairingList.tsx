"use client";

import { Pairing } from "@/types";
import { getT } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

interface PairingListProps {
  pairWith: Pairing[];
  avoidWith: Pairing[];
  separateFrom: Pairing[];
  compact?: boolean;
}

export function PairingList({ pairWith, avoidWith, separateFrom }: PairingListProps) {
  const p = getT(useLocale()).results.plan;
  const hasAnyPairings = pairWith.length > 0 || avoidWith.length > 0 || separateFrom.length > 0;
  if (!hasAnyPairings) return null;

  return (
    <div className="space-y-2 pt-3 border-t border-[#2E1B12]/10">
      {pairWith.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="text-xs tracking-widest uppercase text-[#4A7C59] flex-shrink-0 mt-0.5 w-16">{p.pair}</span>
          <span className="text-xs text-[#9C8B78]">{pairWith.map((x) => x.item).join(", ")}</span>
        </div>
      )}
      {separateFrom.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="text-xs tracking-widest uppercase text-[#FFB326] flex-shrink-0 mt-0.5 w-16">{p.space}</span>
          <span className="text-xs text-[#9C8B78]">
            {separateFrom.map((x) => `${x.item}${x.separationHours ? ` (${x.separationHours}h)` : ""}`).join(", ")}
          </span>
        </div>
      )}
      {avoidWith.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="text-xs tracking-widest uppercase text-red-400 flex-shrink-0 mt-0.5 w-16">{p.avoid}</span>
          <span className="text-xs text-[#9C8B78]">{avoidWith.map((x) => x.item).join(", ")}</span>
        </div>
      )}
    </div>
  );
}
