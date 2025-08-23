// sw.js
const CACHE_NAME = "kraveai-v1";
const OFFLINE_URLS = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
  // Puedes añadir CSS/JS/imágenes estáticas si las mueves a archivos separados
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Sólo GET; el resto déjalo pasar
  if (req.method !== "GET") return;

  event.respondWith(
    (async () => {
      try {
        // Red primero (mejor frescura)
        const net = await fetch(req);
        // Opcional: cachea en segundo plano
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, net.clone()).catch(() => {});
        return net;
      } catch (_) {
        // Offline → intenta cache
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;
        // Fallback básico a index
        return caches.match("./index.html");
      }
    })()
  );
});