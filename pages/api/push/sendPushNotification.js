// pages/api/sendPushNotification.js
import webPush from 'web-push'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Configuration webPush comme dans votre script
    webPush.setVapidDetails(
      'mailto:laurentmichelst@gmail.com',
      process.env.NEXT_PUBLIC_VAPID_KEY,
      process.env.NEXT_PRIVATE_VAPID_KEY
    )

    const subscription = req.body; // Supposons que le corps de la requête contient l'abonnement

    const payload = JSON.stringify({
      title: "Titre de la notification pwa 4",
      body: "Corps de la notification pwa ",
    });

    try {
      await webPush.sendNotification(subscription, payload)
      console.log('Notification push envoyée')
      res.status(200).json({ success: true })
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false })
    }
  } else {
    // Gérer les autres méthodes HTTP si nécessaire
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
