'use client'
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import useFirebase from '@/firebase/useFirebase'

const PageTest = () => {
    const [mypassword, setMyPassword] = useState(123456)
    const [password2, setPassword2] = useState("")
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()
    const { _writeData, _readProfil, profil } = useFirebase()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        if (proId) {
            _readProfil(proId)
        }
    },[proId])

    const _handleWriteData = () => {
        const data = {
            email:"aubaudsalon@gmail.com"
        }
        _writeData(`pro/${proId}/profil`, data)
    }

    const _handleCreatePassword = () => {
        var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString()
        setMyPassword(ciphertext)
    }

    const _handleGetPassword = () => {
        var bytes  = CryptoJS.AES.decrypt(mypassword, 'secret key 123')
        var originalText = bytes.toString(CryptoJS.enc.Utf8)
        console.log('PageTest _handleGetPassword:', originalText, "-", mypassword)
    }

    const _handleSaveIsAuht = () => {
        const proId = localStorage.getItem("proId")
        const data = {
            [proId]:true,
            name:"elodie",
            email:"elodie@gmail.com",
            proId,
            status:"user",
            password:"12345678"
        }
        localStorage.setItem('isAuth', JSON.stringify(data))
    }

    const _handleGetIsAuth = () => {
        let auth = localStorage.getItem("isAuth")
        let authData = JSON.parse(auth)
        console.log('pagetest _handleShwoProId:', authData?.name)
    }

    const _handleRemove = () => {
        localStorage.removeItem('isAuth')
    }

    return (
        <div>

            <div>Page test</div>

            {profil?./*filter(pro => pro.proId === proId).*/map(pro => (
                <div key={pro.id}>{pro.id} {pro.proId} - {proId}</div>
            ))}

            <button className="myButton" onClick={_handleCreatePassword}>Enregistrer</button>

            <button className="myButtonRed" onClick={_handleGetPassword}>Afficher</button>

            <button className="myButtonRed" onClick={_handleRemove}>Remove</button>

            <button className="myButton" onClick={_handleWriteData}>Write</button>

            <div className="flex justify-center">
                <button className="myButtonGrey shadow-lg">Button test</button>
            </div>

        </div>
    )
}

export default PageTest


