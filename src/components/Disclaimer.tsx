"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";
import { getT } from "@/lib/i18n";

interface DisclaimerProps {
  variant?: "inline" | "footer" | "results";
}

export function Disclaimer({ variant = "inline" }: DisclaimerProps) {
  const locale = useLocale();
  const t = getT(locale);

  if (variant === "footer") {
    return (
      <footer className="mt-auto bg-[#2E1B12] py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/methodology" className="text-[#FFB326] hover:underline">
              {t.disclaimer.footer.methodology}
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-white/60">{t.disclaimer.footer.evidenceBased}</span>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === "results") {
    return (
      <div className="border border-[#2E1B12]/10 bg-[#FCFCF7] p-4 mb-6">
        <p className="text-sm text-[#9C8B78]">
          <strong className="text-[#2E1B12]">Important:</strong> This plan is for educational purposes only and does not constitute medical advice. Consult a physician before making changes to your supplement regimen.
        </p>
      </div>
    );
  }

  return (
    <p className="text-xs text-[#9C8B78] italic">
      Educational purposes only. Not medical advice. Consult a physician.
    </p>
  );
}
