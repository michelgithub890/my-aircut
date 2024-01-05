import nodemailer from 'nodemailer'

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { name, email, proId } = req.body
        console.log('send mail abonnement ', name, email, proId)

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
            subject: `Réinitialisez votre mot de passe pour ${name}`,
            text: `
                Cliquez sur ce lien pour réinitialiser votre mot de passe pour ${name},\n
                https://my-aircut.vercel.app//auth/newPassword?search=${proId}&key=${email}\n
                Si vous n'avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer cet e-mail.\n
                Merci, Votre équipe ${name}`,
            // Vous pouvez également utiliser `html` pour un contenu HTML
        }

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).send('Email envoyé avec succès');
        } catch (error) {
            res.status(500).send('Erreur lors envoi email');
        }
        
    } else {
        console.log('=======> not ok')
        res.status(405).send('Méthode non autorisée');
    }
}
