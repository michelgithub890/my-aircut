import admin from "@/firebase/firebaseAdmin"

export default function handler() {
 
    const db = admin.database()

    const pushToComeRef = db.ref('pushToCome')

    pushToComeRef.once('child_added', (snapshot) => {

        const pushData = snapshot.val()
        const keyId = snapshot.key

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayInt = today.getTime()
 
        if (todayInt === pushData.date) {

            // envoyer un push 
            _sendPushNotification(pushData.subscription, pushData.timeString, pushData.company, keyId)
            // envoyer un email 
            _sendEmailNotification(pushData.authName, pushData.authEmail, pushData.company, pushData.timeString)
            // console.log('cron', todayInt, pushData.date)
        }

    })

}


async function _sendPushNotification(subscription, hours, salon, keyId) {
    try {
        // const response = await fetch('http://localhost:3000/api/push/sendPushNotification', {
        const response = await fetch('https://my-aircut.vercel.app/api/push/sendPushNotification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                subscription:subscription,
                title:salon,
                body:`Vous avez rendez-vous à ${hours}`,
            }),             
        })
    
        const data = await response.json()
        if (data.success) {
          console.log('Notification envoyée avec succès')
          _deletePushToCome(keyId)
        } else {
          console.error('Erreur lors de l\'envoi de la notification')
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API', error)
    }
}

async function _deletePushToCome(keyId) {
    try {
        console.log('cron _deletePushToCome:', keyId);
        const db = admin.database();
        await db.ref(`pushToCome/${keyId}`).remove();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
}

async function _sendEmailNotification(nameUser, email, company, hours) {
    try {
        // const response = await fetch('http://localhost:3000/api/email/sendMailBookingToCome', {
        const response = await fetch('https://my-aircut.vercel.app/api/email/sendMailBookingToCome', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ nameUser, email, company, hours }),             
        })
    
        const data = await response.json()
        if (data.success) {
          console.log('email envoyée avec succès')
        } else {
          console.error('Erreur lors de l\'envoi de l email')
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API', error)
    }
}

