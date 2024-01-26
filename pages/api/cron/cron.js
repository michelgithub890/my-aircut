


export default async function handler() {
    let nameUser = "michel"
    let email = "laurentmichelst@gmail.com"
    let proId = "fdjflsdsdmlkfjslmkdfjsdml"
    // const response = await fetch('http://localhost:3000/api/email/sendMailForgotPassword', {
    const response = await fetch('https://my-aircut.vercel.app/api/email/sendMailForgotPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nameUser, email, proId }),
    })
} 



// https://my-aircut.vercel.app/