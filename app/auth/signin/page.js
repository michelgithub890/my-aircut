'use client'
import React, { useState, useEffect } from 'react'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField } from '@mui/material'
// NEXT AUTH 
import { useRouter } from 'next/navigation' 
import Link from 'next/link'
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { MODEL_COLOR } from '@/models/ModelColor'
import HeaderClients from '@/components/clients/HeaderClients'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// CRYPTO JS 
import CryptoJS from 'crypto-js'
 
// Define your validation schema with Yup
const validationSchema = Yup.object({
    email: Yup.string()
                .email('Entrez un email valide')
                .required("L'email est obligatoire."),
    password: Yup.string()
                 .required('Le mot de passe est obligatoire.')
                 .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
                 .max(16, 'Le mot de passe ne doit pas dépasser 16 caractères.')
                 .matches(/^\S*$/, 'Le mot de passe ne peut pas contenir d’espaces'),
})

const Signin = () => {
    const [error, setError] = useState("")
    const router = useRouter()
    const [proId, setProId] = useState("")
    const [isAuth, setIsAuth] = useState("")
    const { _readUsers, users, _updateData } = useFirebase()
    // Initialise React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            const auth = localStorage.getItem('isAuth')
            const authData = auth ? JSON.parse(auth) : []
            setIsAuth(authData)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        if (proId) {
            _readUsers(proId)
        }
    },[proId])

    // Function to handle form submission
    const onSubmit = async (data) => {
        const { email, password } = data

        // demander is l'email est déja enregistré dans la base de donnée 
        const isExist = users.filter(user => user.email === email).length

        if (isExist === 1) {
            // recuperer l'user 
            users.filter(user => user.email === email).map(user => {

                // demander si le mot de passe et égale 
                const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY
                
                const bytes  = CryptoJS.AES.decrypt(user.password, secretKey)
                const originalPassword = bytes.toString(CryptoJS.enc.Utf8)

                // comparer les mots de passes 
                if (originalPassword === password) {
                    const data = {
                        [proId]:true
                    }
                    _updateData(`pro/${proId}/users/${user.id}`, data)
                    localStorage.setItem('isAuth', JSON.stringify(user))
                    router.push("/")
                } else {
                    // mot de passe inconnu 
                    setError("Mot de passe inconnu")
                }
            })

        } else if (isExist === 0) {
            // l'utilisateur nexiste pas 
            setError(`L'utilisateur ${email} n'existe pas, vous devez créer un compte.`)
        }
    }

    return (
        <div>

            <HeaderClients title="Retour" />

            <div className={`grid place-items-center h-screen p-3 bg-slate-300 pb-52`}>

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
                    <TextField 
                        label="Mot de passe"
                        className="blackTextField"
                        type="password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        inputProps={{ maxLength: 16 }}
                    />

                    {error && <div style={{ color:"red"}}>{error}</div>}

                    <button className="myButtonGrey" type="submit">Se connecter</button>

                    <Link href="/auth/forgotPassword" className="text-center"><span className="underline">Mot de passe oublié</span></Link>

                    <Link href="/auth/signup" className="text-center"><span className="underline">Pas de compte ? Créer un compte</span></Link>
                    
                </form>

            </div>

        </div>
    )
}

export default Signin


