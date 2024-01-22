'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import { useRouter } from 'next/navigation' 
// MATERIAL UI 
import { Card } from '@mui/material'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// COMPONENTS 
import HeaderCustom from '@/components/pro/HeaderCustom'

const LookBookingPro = () => {
    const { _deleteData } = useFirebase()
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()
    const [confirm, setConfirm] = useState(false)
    const [bookStorage, setBookStorage] = useState()
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") { 
            const auth = localStorage.getItem('isAuth')
            const authData = auth ? JSON.parse(auth) : []
            setIsAuth(authData)
            // storage book 
            const book = localStorage.getItem('book')
            const bookData = book ? JSON.parse(book) : []
            setBookStorage(bookData)
            // storage proId
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        console.log('lookBookingPro', bookStorage)
    },[bookStorage])

    const _handleConfirm = () => setConfirm(true)

    const _handleDelete = (id) => {
        // delete firebase 
        _deleteData(`pro/${proId}/books/${bookStorage.id}`)
        // router 
        router.push('/pro/bookingPro')
    }

    return (
        <div>

            <HeaderCustom title="Retour" url="/pro/bookingPro" />

            <Card className="text-center m-5 p-3">
                <div >{bookStorage?.dateString}</div>
                <div>à {bookStorage?.timeString}</div>
                <div>avec {bookStorage?.staffSurname}</div>
                <div className="mt-3">{bookStorage?.service}</div>
                <div>{bookStorage?.duration}min - {bookStorage?.price}€</div>
                <div>-------</div>
                <div>Client: {bookStorage?.authName}</div>
                <div>Email: {bookStorage?.authEmail}</div>
            </Card>

            {isAuth?.status !== "staff" && 
                <div className="flex justify-center mt-5">
                    {!confirm ? 
                        <button className="myButtonRed" onClick={_handleConfirm}>Supprimer</button>
                    : 
                        <button className="myButtonRed" onClick={_handleDelete}>Confirmer</button>
                    }
                </div>
            }
            
            <div style={{ height:400 }} /> 

        </div>
    )
}

export default LookBookingPro
