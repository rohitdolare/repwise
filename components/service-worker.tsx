"use client";

import { useEffect } from "react";

/** Registers the service worker (production only) and asks it to cache every page for offline gym use. */
export function ServiceWorker({ urls }: { urls: string[] }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => reg.active?.postMessage({ type: "PRECACHE", urls }))
      .catch(() => {});
  }, [urls]);
  return null;
}
