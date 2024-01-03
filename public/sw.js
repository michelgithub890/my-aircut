// cache name 
const cacheName = 'veille-techno-1.3'

// console.log('hello depuis le service worker')

// ecouter l'installation (self egal service worker) 
self.addEventListener('install', evt => {
  // console.log('install evt', evt)
})

// ecouter l'activation 
self.addEventListener('activate', evt => {
  // console.log('activate evt', evt)
  // NE GARDER QUE LA DERNIERE VERSION DE CACHE 
  // récupérer toutes  les cles
  let cacheCleanPromise = caches.keys().then(keys => {
    // maper les cles 
    keys.forEach(key => {
      // si la clés est différente 
      if (key !== cacheName) {
        // delete la key 
        return caches.delete(key)
      }
    })
  })
  // attendre que toutes les vesions soit mapé avec de supprimer les anciennes versions 
  evt.waitUntil(cacheCleanPromise)

})

// NOTIFICATIONS PUSH 
self.addEventListener('push', evt => {
  const data = JSON.parse(evt.data.text())
  const title = data.title
  const body = data.body
  self.registration.showNotification(title, { 
    body:body, 
    icon: 'assets/icons/icon-96x96.png'
  })
})
