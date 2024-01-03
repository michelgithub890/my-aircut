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

const UpdateList = () => {
    const { _updateData, _readServices, services, _deleteData } = useFirebase()
    const [list, setList] = useState({})
    const [initialName, setInitialName] = useState("")
    const [confirmDelelte, setConfirmDelete] = useState(false)
    const router = useRouter()
    // Initialise React Hook Form 
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        let listData = localStorage.getItem("list")
        let storedListData = JSON.parse(listData)
        setList(storedListData)
        _readServices()
    },[])

    useEffect(() => {
        setValue("name", list.name)
        setInitialName(list.name)
    },[list])

    // Function to handle form submission
    const onSubmit = (data) => {
        const { name } = data

        const dataList = {
            name:name
        }
        _updateData(`services/list/${list.id}`, dataList)
        router.push('/pro/servicesPro')
    }

    // DELETE LIST 
    const _handleDeleteList = () => {
        services.filter(service => service.idList === list.id).map(service => {
            console.log('updateList _handleDeleteList ', service.name)
            _deleteData(`services/items/${service.id}`)
        })
        _deleteData(`services/list/${list.id}`)
        router.push("/pro/servicesPro")
    }

    return ( 
        <div>

            <Link href={"/pro/servicesPro"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            <div className='grid place-items-center p-3'> {/* Replace 'yourColorHere' with your actual color */}
                <div className="text-center text-2xl">Modifier la liste</div>
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
                        defaultValue={initialName}
                        InputLabelProps={{ shrink: true }}
                    />
                    <button className="myButton" type="submit">Enregistrer</button>

                </form>

                <div className="text-red-700 text-center mt-4">Supprimer la liste, avec tous les services associés</div>
                    {!confirmDelelte ? 
                        <button className="myButtonRed" onClick={() => setConfirmDelete(true)}>Supprimer</button>
                    : 
                        <button className="myButtonRed" onClick={_handleDeleteList}>Confirmer</button>
                    }
                </div>
             
        </div>
    )
}

export default UpdateList
