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
// MODELS 
import { MODEL_COLOR } from '@/models/ModelColor'

// Define your validation schema with Yup
const validationSchema = Yup.object({
    name: Yup.string()
                .required("Le nom est obligatoire."),
    price: Yup.string()
                .required("Le prix est obligatoire.")
                .matches(/^\d+(,\d{0,1})?$/, "Le format du prix est invalide. Un maximum d'un chiffre après la virgule est autorisé.")
})

const UpdateService = () => {
    const { _updateData, _deleteData } = useFirebase()
    const [service, setService] = useState({})
    const [initialName, setInitialName] = useState("")
    const [initialPrice, setInitialPrice] = useState("")
    const [valueTime, setValueTime] = useState('15')
    const [confirmDelelte, setConfirmDelete] = useState(false)
    const [proId, setProId] = useState()
    const router = useRouter()
    // Initialise React Hook Form 
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            let serviceData = localStorage.getItem("service")
            let storedServiceData = JSON.parse(serviceData)
            setService(storedServiceData)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        setValue("name", service.name)
        setValue("price", service.price)
        setInitialName(service.name)
        setInitialPrice(service.price)
        setValueTime(service.duration)
    },[service])

    // Function to handle form submission
    const onSubmit = (data) => {
        const { name, price } = data

        const dataService = {
            name,
            price,
            duration:valueTime,
        }
        _updateData(`pro/${proId}/services/items/${service.id}`, dataService)
        router.push('/pro/servicesPro')
    }

    // DELETE LIST 
    const _handleDeleteService = () => {
        _deleteData(`pro/${proId}/services/items/${service.id}`)
        router.push("/pro/servicesPro")
    }

    return ( 
        <div>

            <Link href={"/pro/servicesPro"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            <div className='grid place-items-center p-3'> {/* Replace 'yourColorHere' with your actual color */}
                <div className="text-center text-2xl">Modifier le service</div>
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

                    {/* DURÉE */}
                    <div className='text-center mt-1 mb-2'>Durée</div>
                    <div className='flex justify-around text-center mt-2'>
                        <div 
                            className='border rounded p-1 text-center' 
                            style={{ 
                                backgroundColor: valueTime === '15' ? MODEL_COLOR.blueApply : '', 
                                width: '4rem'
                            }}
                            onClick={() => setValueTime('15')}
                        >15 min</div>
                        <div
                            className='border rounded p-1 text-center' 
                            style={{ 
                                backgroundColor: valueTime === '30' ? MODEL_COLOR.blueApply : '', 
                                width: '4rem'
                            }}
                            onClick={() => setValueTime('30')}   
                        >30 min</div>
                        <div 
                            className='border rounded p-1 text-center'
                            style={{ 
                                backgroundColor: valueTime === '45' ? MODEL_COLOR.blueApply : '', 
                                width: '4rem'
                            }}
                            onClick={() => setValueTime('45')} 
                        >45 min</div>
                        <div
                            className='border rounded p-1 text-center'
                            style={{ 
                                backgroundColor: valueTime === '60' ? MODEL_COLOR.blueApply : '', 
                                width: '4rem'
                            }}
                            onClick={() => setValueTime('60')}               
                        >1 h</div> 
                    </div>

                    <div className='flex justify-around mt-2'>
                        <div 
                            className='border rounded p-1 text-center'
                            style={{ 
                                backgroundColor: valueTime === '75' ? MODEL_COLOR.blueApply : '', 
                                width: '4rem'
                            }}
                            onClick={() => setValueTime('75')} 
                        >1h15</div>
                        <div 
                            className='border rounded p-1 text-center'
                            style={{ 
                                backgroundColor: valueTime === '90' ? MODEL_COLOR.blueApply : '', 
                                width: '4rem'
                            }}
                            onClick={() => setValueTime('90')} 
                        >1h30</div>
                        <div 
                            className='border rounded p-1 text-center'
                            style={{ 
                                backgroundColor: valueTime === '105' ? MODEL_COLOR.blueApply : '', 
                                width: '4rem'
                            }}
                            onClick={() => setValueTime('105')} 
                        >1h45</div> 
                        <div 
                            className='border rounded p-1 text-center mb-2'
                            style={{ 
                                backgroundColor: valueTime === '120' ? MODEL_COLOR.blueApply : '', 
                                width: '4rem',
                            }}
                            onClick={() => setValueTime('120')} 
                        >2h</div>
                    </div> 

                    <TextField
                        label="Prix"
                        className="blackTextField mt-4"
                        {...register("price")}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        defaultValue={initialPrice} 
                        InputLabelProps={{ shrink: true }}
                    />
                    <button className="myButtonGrey" type="submit">Enregistrer</button>

                </form>

                <div className="text-red-700 text-center mt-4">Supprimer le service</div>
                    {!confirmDelelte ? 
                        <button className="myButtonRed" onClick={() => setConfirmDelete(true)}>Supprimer</button>
                    : 
                        <button className="myButtonRed" onClick={_handleDeleteService}>Confirmer</button>
                    }
                </div>

                <div style={{ height:400 }} />
             
        </div>
    )
}

export default UpdateService
