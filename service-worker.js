const CACHE_NAME = "teamworkt-safety-public-v7";
const APP_SHELL = [
  "./",
  "./index.html",
  "./security.html",
  "./privacy.html",
  "./terms.html",
  "./site.webmanifest",
  "./assets/site.css",
  "./assets/teamworkt-safety-logo-trim.png",
  "./assets/jobsite-framing-crew.webp",
  "./assets/previews/management-dashboard.png",
  "./assets/previews/employee-report-mobile.png",
  "./assets/previews/employee-report-desktop.png",
  "./assets/favicon.ico",
  "./assets/favicon-32.png",
  "./assets/apple-touch-icon.png",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png"
];

const RETIRED_DEMO_PATHS = new Set([
  "/dashboard.html",
  "/report.html",
  "/demo.html",
  "/demo-db.js"
]);

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (RETIRED_DEMO_PATHS.has(url.pathname)) {
    event.respondWith(new Response("Not found", {
      status: 404,
      headers: {"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store"}
    }));
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req).then(cached => cached || caches.match("./index.html")))
    );
    return;
  }

  if (!APP_SHELL.some(path => new URL(path, self.location.href).pathname === url.pathname)) return;

  // Network first, so a new deploy is picked up on the next visit.
  // The cached copy is only used when the visitor is offline.
  event.respondWith(
    fetch(req).then(resp => {
      if (resp.ok) {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      }
      return resp;
    }).catch(() => caches.match(req, {ignoreSearch: true}))
  );
});
