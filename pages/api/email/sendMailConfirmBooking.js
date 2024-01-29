import nodemailer from 'nodemailer'

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { name, email, company, date, hours } = req.body 
        console.log('send mail abonnement ', req.body)

        let transporter = nodemailer.createTransport({
            service: 'gmail', // Remplacez par votre service de messagerie
            auth: {
                user: process.env.KEY_EMAIL, // Votre adresse email
                pass: process.env.KEY_GMAIL, // Votre mot de passe email
            },
        })

        const mailOptions = {
            from: process.env.KEY_EMAIL, 
            to: email,
            // to: "laurentmichelst@gmail.com",
            subject: `Réservation ${company}`,
            text: `
                Bonjour ${name},\n
                Vous avez rendez-vous le ${date} à ${hours},\n
                Merci, Votre équipe ${company}`,
            // Vous pouvez également utiliser `html` pour un contenu HTML
        }

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).send('Email envoyé avec succès');
        } catch (error) {
            console.error('Erreur lors envoi email', error)
            res.status(500).send('Erreur lors envoi email');
        }
        
    } else {
        console.log('=======> not ok')
        res.status(405).send('Méthode non autorisée');
    }
}
