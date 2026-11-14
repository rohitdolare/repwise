/* RepWise service worker — makes the installed app work offline in the gym. */
const VERSION = "repwise-v4";
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const SHELL = ["/", "/today", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(precache(SHELL));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "PRECACHE" && Array.isArray(event.data.urls)) {
    event.waitUntil(precache(event.data.urls));
  }
});

const STATIC_RE = /\/(?:_next\/static|media)\/[^"'\s)\\?]+/g;

async function precache(urls) {
  const pages = await caches.open(PAGES);
  const assets = await caches.open(ASSETS);
  const found = new Set();

  const queue = [...urls];
  const worker = async () => {
    while (queue.length) {
      const url = queue.shift();
      try {
        const res = await fetch(url, { credentials: "same-origin" });
        if (!res.ok) continue;
        const type = res.headers.get("content-type") || "";
        if (type.includes("text/html")) {
          const html = await res.clone().text();
          for (const m of html.matchAll(STATIC_RE)) found.add(m[0]);
          await pages.put(url, res);
        } else {
          await assets.put(url, res);
        }
      } catch {
        /* offline or failed — try again next visit */
      }
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);

  for (const asset of found) {
    if (await assets.match(asset)) continue;
    try {
      const res = await fetch(asset);
      if (res.ok) await assets.put(asset, res);
    } catch {
      /* ignore */
    }
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Hashed build assets never change → cache first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/media/")) {
    event.respondWith(cacheFirst(req, ASSETS));
    return;
  }

  // React Server Component payloads (client-side navigation). If offline, answer 503 so the
  // Next.js router falls back to a full page load, which we serve from the page cache below.
  if (req.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) {
    event.respondWith(fetch(req).catch(() => new Response("", { status: 503 })));
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(networkFirstPage(req, url));
    return;
  }

  // Icons, manifest, other public files.
  event.respondWith(staleWhileRevalidate(req, ASSETS));
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => hit || Response.error());
  return hit || network;
}

async function networkFirstPage(req, url) {
  const cache = await caches.open(PAGES);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000)),
    ]);
    if (res.ok) cache.put(url.pathname, res.clone());
    return res;
  } catch {
    return (
      (await cache.match(url.pathname)) ||
      (await cache.match("/today")) ||
      (await cache.match("/")) ||
      new Response("<h1>Offline</h1><p>Open RepWise once while online to save it for offline use.</p>", {
        status: 503,
        headers: { "content-type": "text/html; charset=utf-8" },
      })
    );
  }
}
