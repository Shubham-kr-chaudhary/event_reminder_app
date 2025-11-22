
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received from Backend.');


  let title = "Event Reminder";
  let body = "You have an upcoming event!";
  let icon = "/vite.svg";

  if (event.data) {
    try {
     
      const data = event.data.json();
      console.log('[Service Worker] Data parsed:', data);

      if (data.title) title = data.title;
      if (data.body) body = data.body;
    } catch {
    
      console.error('[Service Worker] JSON Parse Error. Raw text:', event.data.text());
      body = event.data.text();
    }
  }

  const options = {
    body: body,
    icon: icon,
    vibrate: [200, 100, 200], 
    requireInteraction: true, 
    data: {
      dateOfArrival: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked.');
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === 'http://localhost:5173/dashboard' && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('http://localhost:5173/dashboard');
      }
    })
  );
});