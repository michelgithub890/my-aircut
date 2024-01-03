'use client'
import React, { useEffect, useState } from 'react'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField } from '@mui/material'
// NEXT 
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

// Define your validation schema with Yup 
const validationSchema = Yup.object({
    name: Yup.string()
                .required("Le nom est obligatoire.")
})

const UpdateClient = () => {
    const { _updateData, _readUsers, users } = useFirebase()
    const [userSelected, setUserSelected] = useState()
    const [initialName, setInitialName] = useState("")
    const router = useRouter()
    // Initialise React Hook Form 
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        const loadFromLocalStorage = () => {
            try {
                const userData = localStorage.getItem("user")
                const parsedUserData = userData ? JSON.parse(userData) : null
                setUserSelected(parsedUserData)
            } catch (error) {
                console.error('Erreur lors de l\'analyse des données de localStorage:', error)
            }
        }
        loadFromLocalStorage()
        _readUsers()
    },[])

    useEffect(() => {
        users?.filter(user => user.id === userSelected.id).map(user => {
            setInitialName(user.name)
        })
    },[users])

    // Function to handle form submission
    const onSubmit = (data) => {
        const { name } = data
        const dataUser = {
            name
        }
        _updateData(`users/${userSelected?.id}`, dataUser)
        router.push('/pro/clientsPro/clientSingle')
    }

    return (
        <div>

            <Link href={"/pro/clientsPro/clientSingle"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            <div className="text-center mt-3">Modifier client</div>

            <div className='grid place-items-center p-3'> {/* Replace 'yourColorHere' with your actual color */}

                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex flex-col gap-3 bg-white p-5 rounded-lg w-full md:w-3/4 lg:w-1/2 max-w-2xl"
                >
                    <TextField
                        label="Nom"
                        className="blackTextField"
                        {...register("name")}
                        defaultValue={initialName}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        InputLabelProps={{ shrink: true }}
                    /> 

                    <button className="myButton" type="submit">Enregistrer</button>
                    
                </form>
            </div>

        </div>
    )
}

export default UpdateClient
