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

const AddService = () => {
    const { _writeData } = useFirebase()
    const [idList, setIdList] = useState()
    const [nameList, setNameList] = useState()
    const [valueTime, setValueTime] = useState('15')
    const [proId, setProId] = useState()
    const router = useRouter()
    // Initialise React Hook Form 
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            const id  = localStorage.getItem('idList')
            setIdList(id)
            const name = localStorage.getItem('nameList')
            setNameList(name)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    // Function to handle form submission
    const onSubmit = (data) => {
        const { name, price } = data
        console.log(data)

        const dataService = {
            name,
            price,
            duration:valueTime,
            idList:idList,
            nameList:nameList,
        }

        _writeData(`pro/${proId}/services/items`, dataService)
        router.push('/pro/servicesPro')
    }

    return ( 
        <div>

            <Link href={"/pro/servicesPro"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            <div className='grid place-items-center p-3'> {/* Replace 'yourColorHere' with your actual color */}
                <div className="text-center text-2xl">{nameList}</div>
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex flex-col gap-3 bg-white p-5 rounded-lg w-full md:w-3/4 lg:w-1/2 max-w-2xl"
                >
                    <TextField
                        label="Nom du service"
                        className="blackTextField"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
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
                        className="blackTextField"
                        {...register("price")}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                    />
                    <button className="myButtonGrey" type="submit">Enregistrer</button>
                </form>
            </div>

            <div style={{ height:400 }} />
            
        </div>
    )
}

export default AddService
