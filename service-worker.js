/* 
  Service Worker – Additive Unicode-Chiffre (Vigenère-Prinzip)
  Version: v2.4
*/

const CACHE_NAME = "vigenere-pwa-final-c-v2.4";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

/* INSTALL: Dateien vorab cachen */
self.addEventListener("install", event => {
  self.skipWaiting(); // sofort aktivieren
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

/* ACTIVATE: alte Caches entfernen */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // sofort Kontrolle übernehmen
  );
});

/* FETCH: Offline-First mit Fallback */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(response =>
      response ||
      fetch(event.request).catch(() =>
        caches.match("./index.html")
      )
    )
  );
});
