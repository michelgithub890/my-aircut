'use client'
import React, { useState } from 'react'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField } from '@mui/material'
// NEXT AUTH 
import { useRouter } from 'next/navigation' 
import { signIn } from 'next-auth/react'
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
    password: Yup.string()
                 .required('Le mot de passe est obligatoire.')
                 .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
                 .max(16, 'Le mot de passe ne doit pas dépasser 16 caractères.')
                 .matches(/^\S*$/, 'Le mot de passe ne peut pas contenir d’espaces'),
})

const Signin = () => {
    const [error, setError] = useState("")
    const router = useRouter()
    // Initialise React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    // Function to handle form submission
    const onSubmit = async (data) => {
        const { email, password } = data
        // console.log(data)

        try {

            const resUserExists = await fetch("api/userExists", { 
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })

            const {user} = await resUserExists.json()

            if (user) {
                setError("User already exists.")
                return 
            }


            const res = await fetch("api/register", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            })

            if (res.ok) {
                const form = e.target
                form.reset()
                // router.push("/")
            } else {
                console.log("User registration failed.", res)
            }
        } catch {
            console.log("Error during registration: ", error)
        }

        // signin with credential 
        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            // if error update setError  
            if (res.error) {
                setError("Erreur lors de la connection, vérifier vos identifiant 1")
            }

            // it's ok go to home 
            console.log('auth signin ====> ', res)

            // redirection 
            router.push("/clients/homeClients")

        // if error update setError  
        } catch (error) {
            setError("Erreur lors de la connection, vérifier vos identifiant")
            console.log('Erreur lors de la connection, vérifier vos identifiant 2')
        }
        // Place your API call or form handling logic here
    }

    return (
        <div>

            <HeaderClients title="Retour" />

            <div className={`grid place-items-center h-screen p-3`} style={{ backgroundColor:MODEL_COLOR.blueApply}}> {/* Replace 'yourColorHere' with your actual color */}


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

                    <button className="myButton" type="submit">Se connecter</button>

                    <Link href="/auth/forgotPassword" className="text-center"><span className="underline">Mot de passe oublié</span></Link>

                    <Link href="/auth/signup" className="text-center"><span className="underline">Pas de compte ? Créer un compte</span></Link>
                </form>
            </div>

        </div>
    )
}

export default Signin


