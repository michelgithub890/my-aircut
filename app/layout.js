'use client'
// REACT 
import React, { useEffect } from 'react'
// GOOGLE FONT
import { Inter } from 'next/font/google'
// CSS 
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {

  let manifestLink = "/manifest.json"
  let iconLink = "/icon-192x192.png"
  let themeColor = "#000000"

  useEffect(() => {
    _myServiceWorker()
  },[])

  const _myServiceWorker = () => {
  // SERVICE WORKER 
    // y a t il un service worker
    if (navigator.serviceWorker) {
      // enregistrer un service worker 
      navigator.serviceWorker.register('sw.js')
        // recuperer la registration (qui permet d'obtenir l'autorisation des notifications push)
        navigator.serviceWorker.ready.then(registration => {
          // public vapid key generated with web-push 
          const publicKey=process.env.NEXT_PUBLIC_PUBLIC_KEY

          // tenter d'obtenir une souscription 
          registration.pushManager.getSubscription().then(subscription => {
            if(subscription) {
                extractKeysFromBuffer(subscription)
                return subscription;
            } else {
                // ask subscription  
                const convertedKey = urlBase64ToUint8Array(publicKey)
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedKey
                })
                .then(newSubscription => {
                    extractKeysFromBuffer(newSubscription)
                    return newSubscription;
                })   
            }
          })
        })
    }
  }

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String?.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

  function extractKeysFromBuffer(subscription) {
    // no more keys proprety directly visible on the subscription objet. So you have to use getKey()
    const keyArrayBuffer = subscription.getKey('p256dh')
    const authArrayBuffer = subscription.getKey('auth')
    const endpointArrayBuffer = subscription.endpoint
    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer)))
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer)))
    let myP256dh = p256dh.replace(/\//g, "_")
    const data = {
        p256dh:p256dh,
        auth:auth,
        endpoint:endpointArrayBuffer
    }
    console.log('layout', data)
    // _updateData(`tokenClients/${myP256dh}`, data)
}

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href={manifestLink} />
        <link rel="apple-touch-icon" href={iconLink}></link>
        <meta name="theme-color" content={themeColor} />     
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
