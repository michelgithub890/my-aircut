// pages/api/signup.js
import admin from '../../../firebase/firebaseAdmin'

export default async function handler(req, res) {
    console.log('admin sign up ')
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Seules les requêtes POST sont autorisées' })
        return
    }

    const { email, password } = req.body;

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        })

        res.status(200).json({ uid: userRecord.uid })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
