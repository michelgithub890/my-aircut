'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' 
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
// NEXT LINK 
import Link from 'next/link' 
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// COMPONENTS 
import HeaderPro from '@/components/pro/HeaderPro'

// Define your validation schema with Yup
const validationSchema = Yup.object({ 
    name: Yup.string()
                .required("Le nom est obligatoire."),
})

const ClientsPro = () => {
    const { _readUsers, users } = useFirebase()
    const router = useRouter()
    const [name, setName] = useState('')
    const [proId, setProId] = useState()
    // Initialise React Hook Form 
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])
 
    useEffect(() => {
        _readUsers(proId)
    },[proId])

    const handleClearInput = () => {
        setName('')
    }

    const _handleChoiceClient = (user) => {
        localStorage.setItem('user', JSON.stringify(user))
        router.push("/pro/clientsPro/clientSingle")
    } 
 
    return (
        <div>
            <HeaderPro title="Clients" />

            <div className='grid place-items-center p-3'>
                <form className="flex flex-col gap-3 bg-white p-5 rounded-lg w-full md:w-3/4 lg:w-1/2 max-w-2xl">
                    <TextField
                        label="Rechercher un client"
                        className="blackTextField"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleClearInput}>
                                    <CloseIcon />
                                </IconButton>
                            ),
                        }}
                    />
                </form>
            </div>

            {users
                ?.filter(user => user.name.toLowerCase().includes(name.toLowerCase().trim()) && user.status !== "pro")
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(user => (
                    <div key={user.id} className="border-b-2 p-3" onClick={() => _handleChoiceClient(user)} style={{ cursor:"pointer" }}>
                        <div>{user.name}</div>
                    </div>
                ))
            }

            <div style={{ height:400 }} />
        </div>
    )
}

export default ClientsPro
