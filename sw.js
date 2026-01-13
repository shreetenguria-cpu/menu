const CACHE = "menu-v2";
const STATIC = ["./", "index.html", "logo.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;

  if (req.destination === "image") {
    e.respondWith(
      caches.match(req).then(cached => {
        return cached || fetch(req).then(res => {
          return caches.open(CACHE).then(c => {
            c.put(req, res.clone());
            return res;
          });
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(r => r || fetch(req))
  );
});
