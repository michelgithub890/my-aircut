'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation' // Correction ici, c'est 'next/router', pas 'next/navigation'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField } from '@mui/material'
// FIREBASE
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import database, { auth } from "@/firebase/base"
// NEXT LINK 
import Link from 'next/link'
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { MODEL_COLOR } from '@/models/ModelColor'
import HeaderClients from '@/components/clients/HeaderClients'

// Define your validation schema with Yup
const validationSchema = Yup.object({
    email: Yup.string()
                .email('Entrez un email valide')
                .required("L'email est obligatoire."),
})

const ForgotPassword = () => {
    const [error, setError] = useState("")
    const router = useRouter()
    // Initialise React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    // Function to handle form submission
    const onSubmit = async (data) => {
        const { email } = data
        console.log(data)

        try {
            sendPasswordResetEmail(auth, email)
            router.replace("/auth/sendEmailPassword")

        } catch (error) {
            console.log('forgotPassword dont run')
        }
    }

    // className="blackTextField" className="blackButton"

    return (
        <>

            <HeaderClients title="Retour" />

            <div className='grid place-items-center h-screen p-3' style={{ backgroundColor:MODEL_COLOR.blueApply}}> 
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

                    <button className="myButton" type="submit">Envoyer</button>

                    <Link href="/auth/signin" className="text-center"><span className="underline text-slate-600">Annuler</span></Link>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword

