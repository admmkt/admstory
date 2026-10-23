importScripts("version.js");

const CACHE = "stories-" + self.APP_VERSION;
const FONTS_CACHE = "stories-fonts";
const FILES = [
  "./", "index.html", "style.css", "app.js", "version.js",
  "manifest.webmanifest", "icon.svg", "vendor/mediabunny.min.mjs",
  "firebase.js", "conta.js", "../img/adm-digital.png",
];
const RUNTIME_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "www.gstatic.com"]; // fontes e SDK do Firebase

self.addEventListener("install", e => {
  // cache: "reload" ignora o cache HTTP do GitHub Pages, garantindo os arquivos da versão nova
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: "reload"})))));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONTS_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", e => {
  if(e.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);

  if(url.origin === location.origin){
    e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req)));
    return;
  }
  if(RUNTIME_HOSTS.includes(url.hostname)){
    e.respondWith(caches.open(FONTS_CACHE).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if(r.ok || r.type === "opaque") c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
  }
});
