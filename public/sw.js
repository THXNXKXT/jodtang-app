// ponytail: vanilla SW — no @serwist dep, ~30 lines
const CACHE = "jodtang-v2";
const SHELL = ["/", "/transactions", "/reports", "/settings", "/manifest.webmanifest", "/icon.svg", "/apple-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // ponytail: same-origin only — skip cross-origin (Neon, LINE, fonts)
  if (url.origin !== self.location.origin) return;

  // Static assets: cache-first
  if (url.pathname.startsWith("/_next/static/") || url.pathname.match(/\.(svg|png|ico|woff2?)$/)) {
    e.respondWith(caches.match(req).then((c) => c || fetch(req).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((cache) => cache.put(req, copy));
      return r;
    })));
    return;
  }

  // HTML / API: network-first, fallback to cache
  e.respondWith(
    fetch(req)
      .then((r) => {
        if (req.headers.get("accept")?.includes("text/html")) {
          const copy = r.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return r;
      })
      .catch(() => caches.match(req).then((c) => c || caches.match("/"))),
  );
});
