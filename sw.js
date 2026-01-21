const CACHE_NAME = 'cite-steam-mates-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './logo.png'
];

// Instalación: Guarda los archivos en la caché del navegador
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Abriendo caché e insertando archivos');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activación: Limpia cachés antiguas si actualizamos la app
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepción de red: Sirve los archivos desde la caché si están disponibles (modo offline)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en caché, lo devuelve. Si no, lo pide a internet.
                return response || fetch(event.request);
            })
    );

});
