/* KraveAI Service Worker */
const CACHE_NAME = "kraveai-v3";
const STATIC_ASSETS = [
  "/",               // start_url
  "/index.html",
  "/manifest.webmanifest",
  "/icons/robot-192.png",
  "/icons/robot-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_ASSETS);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // limpia caches antiguos
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
      );
      await self.clients.claim();
    })()
  );
});

/**
 * Estrategias:
 * - Navegaciones (mode 'navigate'): network-first con fallback a cache (index).
 * - Misma-origen GET (imgs/css/js): stale-while-revalidate.
 * - Cross-origin: pasar directo a red (no cachear) → arregla fotos en Chrome.
 */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Navegaciones a páginas
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const net = await fetch(req);
          // opcional: actualizar index si viene
          const cache = await caches.open(CACHE_NAME);
          cache.put("/", net.clone()).catch(() => {});
          return net;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match("/")) || (await cache.match("/index.html"));
        }
      })()
    );
    return;
  }

  // Assets mismo origen: S-W-R
  if (sameOrigin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req, { ignoreSearch: true });
        const fetchPromise = fetch(req)
          .then((net) => {
            // Cachea solo 200/opaques de mismo origen
            if (net.ok) cache.put(req, net.clone()).catch(() => {});
            return net;
          })
          .catch(() => null);
        return cached || (await fetchPromise) || cached || fetch(req);
      })()
    );
    return;
  }

  // Cross-origin (e.g. api.kraveapi.xyz avatars): red directa, sin cache
  event.respondWith(fetch(req));
});