const CACHE_NAME = 'ug-tracker-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_REMINDER') {
    const { delay, goal } = event.data;
    setTimeout(() => {
      self.registration.showNotification('UG Life Tracker', {
        body: goal ? `Goal reminder: ${goal}. Don't forget to score this week!` : "Time to score your week! How did it go?",
        icon: '/icons/icon-192.svg',
        badge: '/icons/icon-192.svg',
      });
    }, Math.min(delay, 2147483647));
  }
});
