'use client'
import React, { useEffect, useState } from 'react'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// NEXT 
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField } from '@mui/material'
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// ENCODE PASSWORD 
import CryptoJS from 'crypto-js'

// Schéma de validation mis à jour
const validationSchema = Yup.object({
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

const CreateStaffAcces = () => {
    const { _readStaffs, staffs, _readUsers, users, _writeData, _deleteData } = useFirebase()
    const [staffStored, setStaffStored] = useState()
    const [proId, setProId] = useState()
    const [error, setError] = useState("")
    const [showDeleteAccount, setShowDeleteAccount] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            const staff = localStorage.getItem('staff')
            const staffData = staff ? JSON.parse(staff) : []
            setStaffStored(staffData)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        if (proId) {
            _readStaffs(proId)
            _readUsers(proId)
        }
    },[proId])

    const onSubmit = (data) => {
        const { email, password } = data

        const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY

        var ciphertext = CryptoJS.AES.encrypt(password, secretKey).toString()

        const itemData = {
            [proId]:true,
            name:staffStored.name,
            surname:staffStored.surname,
            status:"staff",
            password:ciphertext,
            planning:true,
            email:email,
            staffId:staffStored.id,
        }
        _writeData(`pro/${proId}/users`, itemData)
    }

    const _handleConfirm = () => {
        setShowDeleteAccount(true)
    }

    const _handleDeleteAccount = (id) => {
        _deleteData(`pro/${proId}/users/${id}`)
    }

    return (
        <div>

            <Link href={"/pro/staffPro/updateStaff"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            {users?.filter(user => user.staffId === staffStored?.id).map(user => (
                <div key={user.id}>
                    <div className="text-center mt-10">{user.surname} a accès à son espace personnel</div>
                    {!showDeleteAccount ? 
                        <div className="flex justify-center mt-10">
                            <button className="myButtonRed" onClick={_handleConfirm}>Supprimer le compte</button>
                        </div>
                    : 
                        <div className="flex justify-center mt-10">
                            <button className="myButtonRed" onClick={() => _handleDeleteAccount(user.id)}>Confirmer</button>
                        </div>
                    }
                </div>
            ))}

            {users?.filter(user => user.staffId === staffStored?.id).length === 0 &&
                <div>

                    <div className="text-center my-3">Vous devez créer un compte</div>

                    <div className={`flex justify-center p-3`}>

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
                        <button type="submit" className="myButtonGrey">{"Créer le compte"}</button>

                    </form>

                    </div>

                </div>
            }

            <div style={{ height:400}} />

        </div>
    )
} 

export default CreateStaffAcces

