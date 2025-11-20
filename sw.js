const CACHE_NAME = 'daily-color-v3';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 安装：缓存核心文件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// 拦截网络请求：优先使用缓存，没有缓存再联网
self.addEventListener('fetch', (event) => {
  // 对于 Unsplash 图片，直接走网络，不缓存（保证每天是新的）
  if (event.request.url.includes('unsplash.com')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// 更新：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});
