// sw.js - tiny service worker so Chrome/Edge treat il_Decimus as an installable app.
// It does not save anything; every request goes straight to the internet.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});   // needed for "Install" to appear in some browsers
