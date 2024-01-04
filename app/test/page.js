'use client'
import React, { useState } from 'react'
import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'
import CryptoJS from 'crypto-js'

const page = () => {
    const [mypassword, setMyPassword] = useState(123456)
    const [password2, setPassword2] = useState("")

    const _handleCreatePassword = () => {
        var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString()
        setMyPassword(ciphertext)
    }

    const _handleGetPassword = () => {
        var bytes  = CryptoJS.AES.decrypt(mypassword, 'secret key 123')
        var originalText = bytes.toString(CryptoJS.enc.Utf8)
    }

    return (
        <div>
            <div>Page test</div>

            <button className="myButton" onClick={_handleCreatePassword}>Enregistrer</button>

            <button className="myButtonRed" onClick={_handleGetPassword}>Afficher</button>
        </div>
    )
}

export default page
