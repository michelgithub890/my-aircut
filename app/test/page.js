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
    const { _readTokens, tokens } = useFirebase()
    const [mykey, setMykey] = useState()

    const array = ["michel", "juliet"]

    useEffect(() => {
      if (typeof window !== "undefined") {
        const proIdStored = localStorage.getItem('proId')
        setProId(proIdStored)
        setMykey(localStorage.getItem('mykey'))
      }
    },[])

    useEffect(() => {
      if (proId) {
        _readTokens(proId)
      }
    },[proId])

    const _getTokens = () => {
      // console.log('test tokens:', proId)
      tokens?.map(token => { 
        // console.log('test tokens:', token)
        const subscription = {
          endpoint:token.endpoint,
          keys: {
            auth: token.auth,
            p256dh: token.p256dh
          }
        }
        let title = "je suis le titre"
        let body = "le suis le message"
        if (subscription) {
          _sendPush(subscription, title, body)
          console.log('test tokens:', subscription, title, body)
        }
      })
    }

    const _sendPush = async (subscription, title, body) => {
      try {
          const response = await fetch('/api/push/sendPushNotification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
              subscription:subscription,
              title:title,
              body:body,
            }),             
          })
      
          const data = await response.json()
          if (data.success) {
            console.log('Notification envoyée avec succès')
          } else {
            console.error('Erreur lors de l\'envoi de la notification')
          }
        } catch (error) {
          console.error('Erreur lors de l\'appel à l\'API', error)
        }
    }

    return (
        <div>

            <div className="text-center p-4">Page Test</div>

            <div className="text-center my-5">mykey: {mykey}</div>

            <div className="flex justify-center">
              <button className="myButton" onClick={_getTokens}>send push</button>
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















