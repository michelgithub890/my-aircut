'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' 
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField } from '@mui/material'
// NEXT LINK 
import Link from 'next/link' 
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

// Define your validation schema with Yup
const validationSchema = Yup.object({
    name: Yup.string()
                .required("Le nom est obligatoire."),
})

const AddList = () => {
    const { _writeData } = useFirebase()
    const [proId, setProId] = useState()
    const router = useRouter()
    // Initialise React Hook Form 
    const { register, handleSubmit, formState: { errors } } = useForm({ 
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        const proIdStored = localStorage.getItem('proId')
        if (proIdStored) setProId(proIdStored)
    },[])

    // Function to handle form submission
    const onSubmit = (data) => {
        const { name } = data
        console.log(data)

        const dataGroup = {
            name:name
        }
        _writeData(`pro/${proId}/services/list`, dataGroup)
        router.push('/pro/servicesPro')
    }

    return ( 
        <div>

            <Link href={"/pro/servicesPro"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            <div className='grid place-items-center p-3'> {/* Replace 'yourColorHere' with your actual color */}
                <div className="text-center text-2xl">Ajouter une liste</div>
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex flex-col gap-3 bg-white p-5 rounded-lg w-full md:w-3/4 lg:w-1/2 max-w-2xl"
                >
                    <TextField
                        label="Nom de la liste"
                        className="blackTextField"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <button className="myButtonGrey" type="submit">Enregistrer</button>
                </form>
            </div>
             
        </div>
    )
}

export default AddList
