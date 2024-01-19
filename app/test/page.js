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

    let settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    useEffect(() => {
        const proIdStored = localStorage.getItem('proId')

    },[])

    return (
        <div>

            <div className="text-center p-4">Page Test</div>

            {array.map(name => {
                if (name === "juliet") {
                    console.log(`page test ${name}`)
                }
            })}

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













