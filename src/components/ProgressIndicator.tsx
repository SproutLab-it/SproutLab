"use client";

import { useLocale } from "./LocaleProvider";
import { getT } from "@/lib/i18n";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  const t = getT(useLocale());
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs tracking-widest uppercase text-[#9C8B78]">
          {t.intake.stepOf(currentStep, totalSteps)}
        </span>
        {stepLabels && stepLabels[currentStep - 1] && (
          <span className="text-xs text-[#9C8B78]">{stepLabels[currentStep - 1]}</span>
        )}
      </div>
      <div className="w-full bg-[#2E1B12]/10 h-px">
        <div
          className="bg-[#FFB326] h-px transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
