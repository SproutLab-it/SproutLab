import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SUPPORTED = ["en", "it"] as const;
type Locale = (typeof SUPPORTED)[number];

const isLocale = (v: string | null | undefined): v is Locale =>
  v === "en" || v === "it";

export function middleware(request: NextRequest) {
  // Language is decided by the visitor's country: Italy gets Italian,
  // every other country (and any request where the country is unknown,
  // e.g. local dev) gets English.
  //
  // An explicit ?lang=en / ?lang=it wins and is remembered in a cookie,
  // so the English version can be previewed from Italy and shared.
  const param = request.nextUrl.searchParams.get("lang");
  const cookie = request.cookies.get("lang")?.value;
  const override = isLocale(param) ? param : isLocale(cookie) ? cookie : null;

  const country = request.headers.get("x-vercel-ip-country");
  const locale: Locale = override ?? (country === "IT" ? "it" : "en");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (isLocale(param)) {
    response.cookies.set("lang", param, { maxAge: 60 * 60 * 24 * 30, path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
