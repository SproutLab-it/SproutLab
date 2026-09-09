import type { Metadata } from "next";
import { headers } from "next/headers";
import { Disclaimer, IframeResizer, LocaleProvider } from "@/components";
import type { Locale } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intake - Evidence-Based Supplement Planner",
  description:
    "Get a personalized, evidence-based supplement plan with timing, dosage, and interaction guidance. Built on peer-reviewed research.",
  keywords: [
    "supplements",
    "vitamins",
    "health",
    "evidence-based",
    "nutrition",
    "wellness",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const locale = (headerStore.get("x-locale") ?? "en") as Locale;

  return (
    <html lang={locale}>
      <body className="antialiased min-h-screen flex flex-col">
        <IframeResizer />
        <LocaleProvider locale={locale}>
          <main className="flex-1 flex flex-col">{children}</main>
          <Disclaimer variant="footer" />
        </LocaleProvider>
      </body>
    </html>
  );
}
