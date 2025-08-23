// sw.js (mínimo para PWA + cache básico)
const CACHE = "kraveai-v1";
const CORE = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/robot-192.png",
  "/icons/robot-512.png",
  "/icons/robot-maskable.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});