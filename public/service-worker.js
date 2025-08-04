const CACHE = 'codex-timer-cache-v1'
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  )
})
