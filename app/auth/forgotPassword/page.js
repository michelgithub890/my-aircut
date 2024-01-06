'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Correction ici, c'est 'next/router', pas 'next/navigation'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField } from '@mui/material'
// NEXT LINK 
import Link from 'next/link'
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// COMPONENTS 
import HeaderClients from '@/components/clients/HeaderClients'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

// Define your validation schema with Yup
const validationSchema = Yup.object({
    email: Yup.string()
                .email('Entrez un email valide')
                .required("L'email est obligatoire."),
})

const ForgotPassword = () => {
    const [error, setError] = useState("")
    const { _readProfil, profil } = useFirebase()
    const [proId, setProId] = useState()
    const router = useRouter()
    // Initialise React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (typeof window!== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        if (proId) {
            _readProfil(proId)
        }
    },[proId])

    // Function to handle form submission
    const onSubmit = async (data) => {
        const { email } = data

        profil?.filter(pro => pro.proId === proId).map(pro => {
            _sendEmailConfirm(pro.company, email, proId)
        })

        router.replace("/")
    }

    const _sendEmailConfirm = async (name, email, proId) => {
        const response = await fetch('/api/email/sendMailForgotPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, proId }),
        })
 
        return response
    }

    return (
        <>

            <HeaderClients title="Retour" />

            <div className='grid place-items-center h-screen p-3 bg-slate-300 pb-52'> 
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex flex-col gap-3 bg-white p-5 rounded-lg w-full md:w-3/4 lg:w-1/2 max-w-2xl"
                >
                    <TextField
                        label="Email"
                        className="blackTextField"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    {error && <div style={{ color:"red"}}>{error}</div>} 

                    <button className="myButtonGrey" type="submit">Envoyer</button>

                    <Link href="/auth/signin" className="text-center"><span className="underline text-slate-600">Annuler</span></Link>
                </form>
        
            </div>
        </>
    )
}

export default ForgotPassword

// /auth/newPassword?search=aubaudsalon12345678