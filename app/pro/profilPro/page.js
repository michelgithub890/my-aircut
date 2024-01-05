'use client'
import React, { useState, useEffect } from 'react'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField } from '@mui/material'
// NEXT  
import { useRouter } from 'next/navigation' 
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
    surname: Yup.string()
                .required("Le prénom est obligatoire."),
    company: Yup.string()
                .required("Le nom de l'établissement est obligatoire."),
    hours: Yup.string()
                .required("Les horaires sont obligatoires."),
    address: Yup.string()
                .required("L'adresse est obligatoire."),
    map: Yup.string()
                .required("Le map est obligatoire."),
    phone: Yup.string()
                .required("Le téléphone est obligatoire."),
})

const ProfilPro = () => {
    const { _updateData, _readProfil, profil } = useFirebase()
    const router = useRouter()
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()
    const [initialName, setInitialName] = useState("")
    const [initialSurname, setInitialSurname] = useState("")
    const [initialCompany, setInitialCompany] = useState("")
    const [initialHours, setInitialHours] = useState("")
    const [initialAddress, setInitialAddress] = useState("")
    const [initialMap, setInitialMap] = useState("")
    const [initialPhone, setInitialPhone] = useState("")
    // Initialise React Hook Form 
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            const auth = localStorage.getItem('isAuth')
            const authData = auth ? JSON.parse(auth) : []
            setIsAuth(authData)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        _readProfil(proId)
    },[proId])

    useEffect(() => {
        profil?.filter(proData => proData.email === isAuth?.email).map(proData => {
            setValue("name", proData.name)
            setValue("surname", proData.surname)
            setValue("company", proData.company) 
            setValue("hours", proData.hours)
            setValue("address", proData.address)
            setValue("map", proData.map)
            setValue("phone", proData.phone)
            setInitialName(proData.name)
            setInitialSurname(proData.surname)
            setInitialCompany(proData.company)
            setInitialHours(proData.hours)
            setInitialAddress(proData.address)
            setInitialMap(proData.map)
            setInitialPhone(proData.phone)
        })
    }, [profil])

    // Function to handle form submission
    const onSubmit = (data) => {
        const { name, surname, company, hours, address, map, phone } = data
        const id = profil[0].id
        const dataProfil = {
            name,
            surname,
            company, 
            hours,
            address,
            map,
            phone,
        }
        _updateData(`pro/${proId}/profil/${id}`, dataProfil)
        router.push('/pro/homePro')
    }

    return (
        <div>
            <HeaderPro title="Profil" /> 

            <div className='grid place-items-center p-3'>  

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
                    <TextField
                        label="Prenom"
                        className="blackTextField"
                        {...register("surname")}
                        defaultValue={initialSurname}
                        error={!!errors.surname}
                        helperText={errors.surname?.message}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Company"
                        className="blackTextField"
                        {...register("company")}
                        defaultValue={initialCompany}
                        error={!!errors.company}
                        helperText={errors.company?.message}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Horaires"
                        className="blackTextField"
                        {...register("hours")}
                        defaultValue={initialHours}
                        error={!!errors.hours}
                        helperText={errors.hours?.message}
                        InputLabelProps={{ shrink: true }}
                        multiline
                        rows={6}
                    />
                    <TextField
                        label="Adresse"
                        className="blackTextField"
                        {...register("address")}
                        defaultValue={initialAddress}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        InputLabelProps={{ shrink: true }}
                        multiline
                        rows={3}
                    />
                    <TextField
                        label="Telephone"
                        className="blackTextField"
                        {...register("phone")}
                        defaultValue={initialPhone}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Map"
                        className="blackTextField"
                        {...register("map")}
                        defaultValue={initialMap}
                        error={!!errors.map}
                        helperText={errors.map?.message}
                        InputLabelProps={{ shrink: true }}
                    />

                    <button className="myButton" type="submit">Enregistrer</button>
                    
                </form>
            </div>

            <div style={{ height:400 }} /> 

        </div>
    )
}

export default ProfilPro
