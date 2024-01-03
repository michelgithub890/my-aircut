'use client'
import React from 'react'
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
                .required("Le nom est obligatoire.")
                .matches(/^\S.*\S$/, "Le nom ne peut pas commencer ou finir par un espace."),
    surname: Yup.string()
                .required("Le prénom est obligatoire.")
                .matches(/^\S.*\S$/, "Le prénom ne peut pas commencer ou finir par un espace."),
})

const AddStaff = () => {
    const { _writeData } = useFirebase()
    const router = useRouter()
    // Initialise React Hook Form 
    const { register, handleSubmit, formState: { errors } } = useForm({ 
        resolver: yupResolver(validationSchema)
    })

    // Function to handle form submission
    const onSubmit = (data) => {
        const { name, surname } = data

        const formattedName = name.trim().toUpperCase()
        const formattedSurname = surname.trim().charAt(0).toUpperCase() + surname.slice(1).toLowerCase()
    
        const dataStaff = {
            name: formattedName,
            surname: formattedSurname
        }
    
        _writeData(`staff`, dataStaff)
        router.push('/pro/staffPro')
    }
    

    return (
        <div>

            <Link href={"/pro/staffPro"}>
                <div className="text-end p-3">Fermer</div> 
            </Link>

            <div className='grid place-items-center p-3'>

                <div className="text-center text-2xl">Ajouter un équipier</div>

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
                        label="Prenom"
                        className="blackTextField"
                        {...register("surname")}
                        error={!!errors.surname}
                        helperText={errors.surname?.message}
                    />

                    <button className="myButton" type="submit">Enregistrer</button>

                </form>
            </div>

            <div style={{ height:400 }} />
        
        </div>
    )
}

export default AddStaff
