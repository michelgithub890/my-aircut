'use client'
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import useFirebase from '@/firebase/useFirebase'

const PageTest = () => {
    const [mypassword, setMyPassword] = useState(123456)
    const [password2, setPassword2] = useState("")
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()
    const { _writeData, _readProfil, profil, _readDaysOff, daysOff, _readStaffs, staffs } = useFirebase()

    useEffect(() => {
        const proIdStored = localStorage.getItem('proId')

    },[])

    const _arrayDays = () => {
        let array = []
        for (let i=0; i < 10; i++) {
            array.push(i)
        }
        return array
    }

    const _arrayDaysOff = () => {
        let array = []
        for (let i=0; i < 10; i++) {
            array.push(i)
        }
        let arrayOff = [2,5]

        let arrayDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        let arrayDaysOff = [{ start: 1, end: 2 }, { start: 5, end: 7 }]

        let filteredArray = arrayDays.filter(day => 
            !arrayDaysOff.some(period => day >= period.start && day <= period.end)
        )

        console.log('page test ', filteredArray)

    }

    // arrayDays = [0,1,2,3,4,5,6,7,8,9,10]
    // arrayDaysOff = [1,3,7]
    // arrayDaysOff= [{start:1, end:2}, {start:5, end:7}]

    return (
        <div>

            <div>Page test</div>

            {_arrayDays().map(day => (
                <div key={day}>{day}</div>
            ))}

            <div className="flex justify-center">
                <button className="myButton" onClick={_arrayDaysOff}>test</button>
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