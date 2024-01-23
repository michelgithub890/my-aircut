'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import { useRouter } from 'next/navigation' 
import Link from 'next/link'
// MATERIAL UI 
import { TextField, IconButton, Card, CardContent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// COMPONENTS 
import HeaderCustom from '@/components/pro/HeaderCustom'
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

// Define your validation schema with Yup
const validationSchema = Yup.object({ 
    name: Yup.string(),
                // .required("Le nom est obligatoire."),
    nameClient: Yup.string()
                .required("Le nom est obligatoire."),
})

const AddBookingPlanning = () => {
    const { _readLists, lists, _readServices, services, _readUsers, users, _writeData } = useFirebase()
    const [proId, setProId] = useState()
    const [selectedService, setSelectedService] = useState()
    const [selectedClient, setSelectedClient] = useState()
    const [name, setName] = useState('')
    const [quartStored, setQuartStored] = useState()
    const [clientOff, setClientOff] = useState(false)
    const router = useRouter()

    // Initialise React Hook Form 
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if (typeof window !== "undefined") { 
            const quart = localStorage.getItem('quart')
            const quartData = quart ? JSON.parse(quart) : []
            setQuartStored(quartData)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        if (proId) {
            _readLists(proId)
            _readServices(proId)
            _readUsers(proId)
            console.log('addBookingPlanning', quartStored)
        }
    },[proId])

    const _handleService = (service) => {
        setSelectedService({id:service.id, name:service.name, price:service.price, duration:service.duration})
    }

    const _handleClient = (client) => {
        setSelectedClient({id:client.id, name:client.name, email:client.email})
    }

    const handleClearInput = () => {
        setName('')
    }

    const _convertMinutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }

    const _handleSave = () => {
        const dataSave = {
            date: quartStored?.date.dayInt,
            dateString: quartStored?.date.day,
            service:selectedService?.name,
            serviceId:selectedService?.id,
            price:selectedService?.price,
            duration:parseInt(selectedService?.duration),
            time:quartStored?.quart,
            timeString:_convertMinutesToHours(quartStored?.quart),
            staffId:quartStored?.staff.id,
            staffSurname:quartStored?.staff.surname,
            authEmail:selectedClient?.email,
            authId:selectedClient?.id,
            authName:selectedClient?.name
        }
        console.log('addBookingPlanning', dataSave)
        _writeData(`pro/${proId}/books`, dataSave)
        router.push('/pro/bookingPro')
    }

    const _handleClientOff = () => {
        setClientOff(!clientOff)
        setSelectedClient('')
        setValue('nameClient', '')

    }

    // Function to handle form submission
    const onSubmit = (data) => {
        const { nameClient } = data
        setSelectedClient({id:"Client non enregistré", name:data.nameClient, email:"Client non enregistré"})
    }

    return (
        <div>

            <HeaderCustom title="Retour" url="/pro/bookingPro" />

            <div className="p-3">

                <Card>
                    <CardContent>
                        <div className="text-center">
                            <div>{quartStored?.date.day}</div>
                            <div>à {_convertMinutesToHours(quartStored?.quart)}</div>
                            <div>avec {quartStored?.staff.surname}</div>
                            {selectedService && 
                                <div className="mt-3">{selectedService?.name}</div>
                            }
                            {selectedClient && 
                                <div>{selectedClient?.name}</div>
                            }
                        </div>
                    </CardContent>
                </Card>

                {!selectedService ? 
                    <>
                        <div className="my-3">1 - Choisir un service</div> 

                        {lists?.sort((a,b) => a.name.localeCompare(b.name)).map(list => (
                            <div key={list.id}>
                                <div className="bg-slate-200 p-2">{list.name}</div>
                                {services
                                    ?.sort((a,b) => a.name.localeCompare(b.name))
                                    .filter(service => service[quartStored?.staff.id])
                                    .filter(service => service.idList === list.id)
                                    .map(service => (
                                    <div key={service.id}>
                                        <div className="p-2" onClick={() => _handleService(service)} style={{ cursor:"pointer" }}>{service.name}</div>
                                    </div>
                                ))}
                            </div>
                        ))} 
                    </>
                :  
                    <>

                        {!selectedClient ? 
                            <>
                                <div className="my-3">2 - Choisir un client</div>

                                {clientOff && 
                                    <div>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <TextField
                                                label="Client non enregistré"
                                                className="blackTextField"
                                                {...register("nameClient")}
                                                error={!!errors.nameClient}
                                                helperText={errors.nameClient?.message}
                                            />
                                            <div className="flex gap-4">
                                                <button className="myButtonGrey" type="submit">Enregistrer</button>
                                                <button className="myButtonRed" onClick={_handleClientOff}>Annuler</button>
                                            </div>
                                        </form>
                                    </div>
                                }

                                {!clientOff && 
                                    <>
                                        <div onClick={_handleClientOff}>Client non enregistré</div>

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
                                            ?.filter(user => user.name.toLowerCase().includes(name.toLowerCase().trim()) && user.status !== "pro" && user.status !== "staff")
                                            .sort((a,b) => a.name.localeCompare(b.name))
                                            .map(user => (
                                            <div key={user.id}>
                                                <div className="p-3" style={{ cursor:"pointer" }} onClick={() => _handleClient(user)}>{user.name}</div>
                                            </div>
                                        ))}
                                    </>
                                }

                            </>
                        : 
                            <div className="flex justify-center mt-5">
                                <button className="myButtonGrey" onClick={_handleSave}>Enregistrer</button>
                            </div>
                        }
                    </>
                }

            </div>


            <div style={{ height:400 }} /> 

        </div>
    )
}

export default AddBookingPlanning
