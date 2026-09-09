"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function IframeResizer() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.self === window.top) return;

    // Belt-and-suspenders alongside the server-side Sec-Fetch-Dest check in
    // layout.tsx: mark the document as embedded so globals.css can drop the
    // full-viewport min-height/flex sizing and let the height be content-driven.
    document.documentElement.setAttribute("data-embedded", "");

    const send = () => {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight ?? 0,
        document.documentElement.offsetHeight,
      );
      window.parent.postMessage({ type: "intake-resize", height }, "*");
    };

    send();

    const observer = new ResizeObserver(send);
    observer.observe(document.documentElement);
    if (document.body) observer.observe(document.body);

    // Re-send after fonts, images and entrance animations settle, since the
    // initial measurement can land before late layout (e.g. the wellness card).
    const timers = [100, 400, 900, 1600].map((t) => window.setTimeout(send, t));
    window.addEventListener("load", send);
    document.fonts?.ready.then(send).catch(() => {});

    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", send);
    };
  }, [pathname]);

  return null;
}
