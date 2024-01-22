'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import { useRouter } from 'next/navigation' 
import Link from 'next/link'
// MATERIAL UI 
import { TextField, IconButton, Card } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// COMPONENTS 
import HeaderCustom from '@/components/pro/HeaderCustom'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

const LookBookingPro = () => {
    const { _deleteData } = useFirebase()
    const [proId, setProId] = useState()
    const [confirm, setConfirm] = useState(false)
    const [bookStorage, setBookStorage] = useState()
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") { 
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

            <div className="flex justify-center mt-5">
                {!confirm ? 
                    <button className="myButtonRed" onClick={_handleConfirm}>Supprimer</button>
                : 
                    <button className="myButtonRed" onClick={_handleDelete}>Confirmer</button>
                }
            </div>
            
            <div style={{ height:400 }} /> 

        </div>
    )
}

export default LookBookingPro
