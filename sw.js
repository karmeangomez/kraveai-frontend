// ---- KraveAI Service Worker ----
const STATIC_CACHE  = "kraveai-static-v3";
const RUNTIME_CACHE = "kraveai-runtime-v3";

const PRECACHE_URLS = [
  "/",               // start_url
  "/index.html",
  "/manifest.webmanifest",
  "/icons/robot-192.png",
  "/icons/robot-512.png",
];

// Utilidad
const sameOrigin = (url) => new URL(url).origin === self.location.origin;

// Instala: precache estático
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      self.skipWaiting();
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(PRECACHE_URLS);
    })()
  );
});

// Activa: limpia versiones viejas + navigation preload
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) =>
          k !== STATIC_CACHE && k !== RUNTIME_CACHE ? caches.delete(k) : null
        )
      );
      if (self.registration.navigationPreload) {
        try { await self.registration.navigationPreload.enable(); } catch {}
      }
      await self.clients.claim();
    })()
  );
});

// Mensajes desde la página (para limpiar caché/actualizar)
self.addEventListener("message", (event) => {
  const { type } = event.data || {};
  if (type === "SKIP_WAITING") self.skipWaiting();
  if (type === "CLEAR_CACHES") {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
        await caches.open(STATIC_CACHE).then(c => c.addAll(PRECACHE_URLS));
      })()
    );
  }
});

// Estrategias de fetch
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // 1) Navegación de páginas → network-first con fallback a index.html
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        // Intenta usar Navigation Preload si está
        const preloaded = await event.preloadResponse;
        if (preloaded) return preloaded;

        const net = await fetch(req, { cache: "no-store" });
        // Actualiza el caché estático con la última index si aplica
        const cache = await caches.open(STATIC_CACHE);
        cache.put("/", net.clone()).catch(() => {});
        return net;
      } catch {
        // Offline → usa index precacheada
        const cached = await caches.match("/index.html", { ignoreSearch: true });
        return cached || new Response("<h1>Offline</h1>", { headers: { "Content-Type": "text/html" }});
      }
    })());
    return;
  }

  // 2) No tocar recursos de otros orígenes (API externa, etc.)
  if (!sameOrigin(req.url)) return;

  // 3) Nunca cachear endpoints dinámicos/volátiles
  if (url.pathname.startsWith("/health") || url.pathname.startsWith("/api") ||
      url.pathname.startsWith("/buscar-usuario") || url.pathname.startsWith("/buscar-usuarios") ||
      url.pathname.startsWith("/avatar")) {
    // network-only
    event.respondWith(fetch(req).catch(() => new Response("", { status: 503 })));
    return;
  }

  // 4) Static assets same-origin → stale-while-revalidate sencillo
  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    const fetchPromise = fetch(req).then((net) => {
      cache.put(req, net.clone()).catch(() => {});
      return net;
    }).catch(() => null);
    return cached || (await fetchPromise) || new Response("", { status: 504 });
  })());
});