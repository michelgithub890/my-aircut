'use client'
import React, { useState, useEffect } from 'react'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MUI 
import { TextField } from '@mui/material'
// NEXT 
import { useSearchParams, useRouter } from 'next/navigation'
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// ENCODE PASSWORD 
import CryptoJS from 'crypto-js'

// Schéma de validation mis à jour
const validationSchema = Yup.object({
  password: Yup.string()
               .required('Le mot de passe est obligatoire.')
               .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
               .max(16, 'Le mot de passe ne doit pas dépasser 16 caractères.')
               .matches(/^\S*$/, 'Le mot de passe ne peut pas contenir d’espaces'),
  confirmPassword: Yup.string()
               .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
               .required('La confirmation du mot de passe est obligatoire.')
})

const NewPassword = () => {
    const searchParams = useSearchParams()
    const [montage, setMontage] = useState(false)
    const [email, setEmail] = useState()
    const [proId, setProId] = useState()
    const [error, setError] = useState("")
    const { _readUsers, users, _updateData } = useFirebase() 
    const router = useRouter()
 
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(validationSchema)
  })

    useEffect(() => {
        setMontage(true)
    },[])
  
    useEffect(() => {
      if (montage) {
        const search = searchParams.get('search')
        const key = searchParams.get('key')
      
        console.log('NewPassword:', search, key) 
        if (search) {
          _readUsers(search)
          setProId(search)
          setEmail(key)
        }
      }
    },[montage])

    const onSubmit = (data) => {
      const { password } = data

      // vérifier si l'email existe dans la base de donnée correspondant 
      
      const isUser = users?.filter(user => user.email === email).length

      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY

      var ciphertext = CryptoJS.AES.encrypt(password, secretKey).toString()

      console.log('newPassword:', password, users, email, isUser, ciphertext)

      if (isUser > 0) {
        users.filter(user => user.email === email).map(user => {
          const userData = {
            password:ciphertext
          }
          _updateData(`pro/${proId}/users/${user.id}`, userData)
          router.replace("/")
        })
      } else {
        setError("Une erreur est survenue")
      }
  }


    return (
        <div>
            <div className='grid place-items-center h-screen p-3 bg-slate-300 pb-52'>
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex flex-col gap-3 bg-white p-5 rounded-lg w-full md:w-3/4 lg:w-1/2 max-w-2xl"
                >
                    <div className="text-center p-3">Renseignez un nouveau mot de passe</div>
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
                    <button type="submit" className="myButtonGrey">Changer le mot de passe</button>
                </form>
            </div>
        </div>
    )
}

export default NewPassword


