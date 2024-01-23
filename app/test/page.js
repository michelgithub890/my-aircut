'use client'
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import useFirebase from '@/firebase/useFirebase'
// REACT SLICK 
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Planning from '@/components/pro/Planning'

const PageTest = () => {
    const [mypassword, setMyPassword] = useState(123456)
    const [password2, setPassword2] = useState("")
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()
    const { _writeData, _readProfil, profil, _readDaysOff, daysOff, _readStaffs, staffs } = useFirebase()

    const array = ["michel", "juliet"]



    useEffect(() => {
        const proIdStored = localStorage.getItem('proId')

    },[])

    const subscription = {
        endpoint:"https://fcm.googleapis.com/fcm/send/c0vb0DnGado:APA91bEA-X3RablpFtZmeY3GrLbu9j0wwxK9aQPlrEjQgcpOX1xRFC17md_oYv8nEzZMl4E1s9FL7a9CwdItMyvZFKvRMdTMWZPz1D0dWNy9IagiEB2QdYH4hMMkXTj6Yaov9TwVmS0-",
        keys: {
            auth:"nk3CWnV8pMqfVcYobKQW0A==",
            p256dh: "BPxtuuquPB98AhsKH/RH8e2Xcx0YJls2G8l6wzQWhsqYFZG4bwaSnw8rOd9VXgxpW+2PkSvsiaAZwkz9aX7E1zk="
        }
    }

    const _sendPush = async () => {
        try {
            const response = await fetch('/api/push/sendPushNotification', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(subscription), // Envoyer l'objet d'abonnement
            });
        
            const data = await response.json();
            if (data.success) {
              console.log('Notification envoyée avec succès');
            } else {
              console.error('Erreur lors de l\'envoi de la notification');
            }
          } catch (error) {
            console.error('Erreur lors de l\'appel à l\'API', error);
          }
    }

    return (
        <div>

            <div className="text-center p-4">Page Test</div>

            <div className="flex justify-center">
                <button className="myButton" onClick={_sendPush}>send push</button>
            </div>

        </div>
    )
}

export default PageTest


/*

    const _handleCreatePassword = () => {
        var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString()
        setMyPassword(ciphertext)
    }

    const _handleGetPassword = () => {
        var bytes  = CryptoJS.AES.decrypt(mypassword, 'secret key 123')
        var originalText = bytes.toString(CryptoJS.enc.Utf8)
        console.log('PageTest _handleGetPassword:', originalText, "-", mypassword)
    }

*/













