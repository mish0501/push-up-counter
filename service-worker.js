importScripts("/push-up-counter/precache-manifest.39eeec804042ef402c3a8c5d93d9bae1.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', e => {
  if (!e.data) {
    return
  }

  switch (e.data) {
    case 'skipWaiting':
      self.skipWaiting()
      break
    default:
      // NOOP
      break
  }
})

self.addEventListener('notificationclick', event => {
  let notification = event.notification
  notification.close()

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i]

          if (client.url == notification.data.url && 'focus' in client)
            return client.focus()
        }
        if (clients.openWindow) return clients.openWindow(notification.data.url)
      }),
  )
})

workbox.core.clientsClaim()

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

