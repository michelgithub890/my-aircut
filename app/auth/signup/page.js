'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import Link from 'next/link'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import useFirebase from '@/firebase/useFirebase'
// MODELS 
import { MODEL_COLOR } from '@/models/ModelColor'
// HEADER 
import HeaderClients from '@/components/clients/HeaderClients'
// ENCODE PASSWORD 
import CryptoJS from 'crypto-js'

// Schéma de validation mis à jour
const validationSchema = Yup.object({
    email: Yup.string()
        .required("Le nom est obligatoire."),
    email: Yup.string()
                .email('Entrez un email valide')
                .required("L'email est obligatoire."),
    password: Yup.string()
                 .required('Le mot de passe est obligatoire.')
                 .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
                 .max(16, 'Le mot de passe ne doit pas dépasser 16 caractères.')
                 .matches(/^\S*$/, 'Le mot de passe ne peut pas contenir d’espaces'),
    confirmPassword: Yup.string()
                 .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
                 .required('La confirmation du mot de passe est obligatoire.')
})

const SignUp = () => {
    const [error, setError] = useState("")
    const { _writeData, _readUsers, users } = useFirebase()
    const [proId, setProId] = useState("")
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            console.log("signup useEffect ", proIdStored)
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        if (proId) _readUsers(proId)
    },[proId])

    const onSubmit = (data) => {
        const { email, password, name } = data
        const endpoint = localStorage.getItem('endpoint')
        const p256dh = localStorage.getItem('p256dh')
        const auth = localStorage.getItem('auth')

        const isUser = users?.filter(user => user.email === email).length

        const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY

        var ciphertext = CryptoJS.AES.encrypt(password, secretKey).toString()

        console.log('signin users/', users)

        if (isUser === 0) {
            const itemData = {
                [proId]:true,
                name:name,
                email:email,
                status:"user",
                endpoint:endpoint,
                p256dh:p256dh,
                auth:auth,
                password:ciphertext
            }
            // console.log('signin isUser ', itemData)
            _writeData(`pro/${proId}/users`, itemData)
            localStorage.setItem('isAuth', JSON.stringify(itemData))
            router.push("/")
        } else {
            setError("Vous êtes déja enregistré, veuillez vous connecter.")
        }
    }

    return (
        <div>

            <HeaderClients title="Retour" />

            <div className='grid place-items-center h-screen p-3 bg-slate-300 pb-52'>
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex flex-col gap-3 bg-white p-5 rounded-lg w-full md:w-3/4 lg:w-1/2 max-w-2xl"
                >
                    <TextField
                        label="Nom"
                        className="blackTextField"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <TextField
                        label="Email"
                        className="blackTextField"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        label="Mot de passe"
                        type="password"
                        className="blackTextField"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        inputProps={{ maxLength: 16 }}
                    />
                    <TextField
                        label="Confirmer le mot de passe"
                        type="password"
                        className="blackTextField"
                        {...register("confirmPassword")}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />

                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <button type="submit" className="myButtonGrey">S&apos;inscrire</button>

                    <Link href="/auth/signin" className="text-center"><span className="underline">Déjà un compte ? Se connecter</span></Link>
                </form>
            </div>

        </div>
    )
}

export default SignUp












