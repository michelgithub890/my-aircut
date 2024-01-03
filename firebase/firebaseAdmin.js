// lib/firebaseAdmin.js

import admin from 'firebase-admin'

// Vérifie si l'instance de Firebase Admin a déjà été initialisée
if (!admin.apps.length) {
    // Initialisez Firebase Admin avec vos informations de configuration
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
            clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            // Assurez-vous que votre clé privée est correctement encodée dans les variables d'environnement
        }),
        // Ajoutez d'autres configurations nécessaires ici
    })
}

export default admin
