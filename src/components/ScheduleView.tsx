"use client";

import { ScheduleGroup } from "@/types";
import { getT } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";
import { SupplementCard } from "./SupplementCard";

interface ScheduleViewProps {
  schedule: ScheduleGroup[];
}

export function ScheduleView({ schedule }: ScheduleViewProps) {
  const p = getT(useLocale()).results.plan;

  if (schedule.length === 0) {
    return (
      <div className="text-center py-12 text-[#9C8B78]">
        {p.empty}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {schedule.map((group) => (
        <section key={group.timeOfDay}>
          <div className="flex items-center gap-4 mb-4 pb-3 border-b border-[#2E1B12]/10">
            <h2 className="text-sm tracking-widest uppercase text-[#9C8B78]">
              {p.timeOfDay[group.timeOfDay]}
            </h2>
            <span className="text-xs text-[#9C8B78]">
              {p.supplementCount(group.supplements.length)}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {group.supplements.map((supplement) => (
              <SupplementCard key={supplement.slug} supplement={supplement} showDetails={false} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
