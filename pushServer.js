const webPush = require('web-push') 

// console.log(webPush, pushServerKeys, pushClientSubscription)

webPush.setVapidDetails(
    'mailto:laurentmichelst@gmail.com', 
    'BM0bWABJSUWwT9oywVbdEU-opNfPlij92O4-cmB4OFWApcrqO9R2b4MNSxPq_9NsxDEDeZw74rIsV5Xhg2XSYks', 
    'NoroD0qdddjJLw_ZIgjEykqjLhxRO0e4-CCcQLP0qRo'
)

const subscription = {
    endpoint:"https://fcm.googleapis.com/fcm/send/c0vb0DnGado:APA91bEA-X3RablpFtZmeY3GrLbu9j0wwxK9aQPlrEjQgcpOX1xRFC17md_oYv8nEzZMl4E1s9FL7a9CwdItMyvZFKvRMdTMWZPz1D0dWNy9IagiEB2QdYH4hMMkXTj6Yaov9TwVmS0-",
    keys: {
        auth:"nk3CWnV8pMqfVcYobKQW0A==",
        p256dh: "BPxtuuquPB98AhsKH/RH8e2Xcx0YJls2G8l6wzQWhsqYFZG4bwaSnw8rOd9VXgxpW+2PkSvsiaAZwkz9aX7E1zk="
    }
}

const payload = JSON.stringify({
    title: "Titre de la notification pwa",
    body: "Corps de la notification pwa",
})

console.log("avant sendNotification", subscription)
webPush.sendNotification(subscription, payload)
        .then(res => console.log('ma push notif a bien été poussée', res, payload))
        .catch(err => console.error(err))

console.log('pushServer ')