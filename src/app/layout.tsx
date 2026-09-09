import type { Metadata } from "next";
import { headers } from "next/headers";
import { IframeResizer, LocaleProvider } from "@/components";
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
  // When the app is loaded inside the WordPress iframe the height must be
  // purely content-driven, otherwise `min-h-screen` (100vh = the iframe's own
  // viewport) and the IframeResizer feed each other and leave a tall empty
  // gap at the bottom. Standalone visits still get a full-height layout.
  const embedded = headerStore.get("sec-fetch-dest") === "iframe";

  return (
    <html lang={locale}>
      <body className={`antialiased flex flex-col${embedded ? "" : " min-h-screen"}`}>
        <IframeResizer />
        <LocaleProvider locale={locale}>
          <main className={embedded ? "" : "flex-1 flex flex-col"}>{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}
