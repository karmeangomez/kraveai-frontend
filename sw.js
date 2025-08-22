self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
// Tener un fetch handler activo ayuda a cumplir criterios de instalación
self.addEventListener('fetch', () => {});