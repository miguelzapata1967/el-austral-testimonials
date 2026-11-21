// sw.js - tiny service worker so Chrome/Edge let visitors install El Austral Consultant
// as a desktop icon. It saves nothing; every page comes straight from the internet.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
