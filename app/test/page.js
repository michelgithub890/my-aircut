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

    const _filterArray = () => {
        const array1 = [1,2,3,4,5]
        const array2 = ["a","b","c"]
        const array3 = ["d","e","f"]
        const array4 = ["g","h","i"]

        const arrayFinal = []

        array1.forEach(a1 => {
            let arrayForA2 = []
            array2.forEach(a2 => {
                let arrayForA3 = []
                array3.forEach(a3 => {
                    let arrayForA4 = []
                    array4.forEach(a4 => {
                        arrayForA4.push(a4)
                    })
                    if (array4.length > 0)
                    arrayForA3.push([a3, arrayForA4])
                })
                if (arrayForA3 > 0) {
                    arrayForA2.push([a2, arrayForA3])
                }
            })
            if (arrayForA2.length > 0) {
                arrayFinal.push([a1, arrayForA2])
            }
        })
        console.log('page test', arrayFinal)
    }

    const _handleHours = () => {
        let array = []
        for (let i = 0; i < 14400; i += 15) {   
            array.push(i)
        }
        console.log('test _handleHours:', array)
    }

    return (
        <div>

            <div>Page test</div>

            {_arrayDays().map(day => (
                <div key={day}>{day}</div>
            ))}

            <div className="flex justify-center">
                <button className="myButton" onClick={_handleHours}>test</button>
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













