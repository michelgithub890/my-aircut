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
    const { _readLists, lists, _readServices, services, _readUsers, users, _writeData, _readProfil, profil, _readBooks, books } = useFirebase()
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
            _readProfil(proId)
            _readBooks(proId)
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

        // PROFIL COMPANY 
        const salon = profil?.filter(pro => pro.proId === proId).map(pro => pro.nameCompany)

        // PUSH DIRECT 
        let endpoint = ""
        let auth = ""
        let p256dh = ""

        users?.filter(user => user.id === selectedClient.id).map(user => {
            endpoint = user.endpoint
            auth = user.auth 
            p256dh = user.p256dh
        })

        const subscription = {
            endpoint:endpoint,
            keys: {
                auth: auth,
                p256dh: p256dh
            }
        }

        let totalTime = quartStored?.quart + parseInt(selectedService?.duration)

        let arrayBooks = []

        books
            .filter(book => book.date === quartStored?.dayInt)
            .filter(book => book.staffId === quartStored?.staff.id)
            .filter(book => quartStored?.quart < book.time + book.duration && totalTime > book.time)
            .map(book => arrayBooks.push("book", book))

        if (arrayBooks.length > 0) {

            alert("La plage horaire n'est pas suffisante pour enregistrer le service")

        } else {

            const dataSave = {
                date: quartStored?.dayInt,
                dateString: quartStored?.day,
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
                authName:selectedClient?.name,
                subscription:subscription.endpoint ? subscription : "",
            }

            console.log('addBookingPlanning ', dataSave)

            _writeData(`pro/${proId}/books`, dataSave)

            if (endpoint) {
                _writeData(`pushToCome`, dataSave)
                _sendPush(subscription, _convertMinutesToHours(quartStored?.quart), quartStored?.day, salon)
            }

            router.push('/pro/bookingPro')
        }

    }

    const _sendPush = async (subscription, hours, day, salon) => {
        try {
            // const response = await fetch('http://localhost:3000/api/push/sendPushNotification', {
            const response = await fetch('/api/push/sendPushNotification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    subscription:subscription,
                    title:salon,
                    body:`Vous avez rendez-vous le ${day} à ${hours}`,
                }),             
            })
        
            const data = await response.json()
            if (data.success) {
              console.log('Notification envoyée avec succès')
              // _deletePushToCome(keyId)
            } else {
              console.error('Erreur lors de l\'envoi de la notification')
            }
        } catch (error) {
            console.error('Erreur lors de l\'appel à l\'API', error)
        }
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
                            <div>{quartStored?.day}</div>
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
                                        <button className="myButtonGrey" onClick={_handleClientOff}>Client non enregistré</button>

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

                                        {users
                                            ?.filter(user => user.name.toLowerCase().includes(name.toLowerCase().trim()) && user.status !== "pro" && user.status !== "staff")
                                            .sort((a,b) => a.name.localeCompare(b.name))
                                            .map(user => (
                                            <div key={user.id}>
                                                <div className="p-3 border-2 mt-1" style={{ cursor:"pointer" }} onClick={() => _handleClient(user)}>{user.name}</div>
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


// 'use client'
// import React, { useState, useEffect } from 'react'
// // NEXT 
// import { useRouter } from 'next/navigation' 
// import Link from 'next/link'
// // MATERIAL UI 
// import { TextField, IconButton, Card, CardContent } from '@mui/material'
// import CloseIcon from '@mui/icons-material/Close'
// // FIREBASE 
// import useFirebase from '@/firebase/useFirebase'
// // COMPONENTS 
// import HeaderCustom from '@/components/pro/HeaderCustom'
// // REACT HOOK FORM 
// import { useForm } from 'react-hook-form'
// // YUP 
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as Yup from 'yup'

// // Define your validation schema with Yup 
// const validationSchema = Yup.object({ 
//     name: Yup.string(),
//                 // .required("Le nom est obligatoire."),
//     nameClient: Yup.string()
//                 .required("Le nom est obligatoire."),
// })

// const AddBookingPlanning = () => {
//     const { _readLists, lists, _readServices, services, _readUsers, users, _writeData } = useFirebase()
//     const [proId, setProId] = useState()
//     const [selectedService, setSelectedService] = useState()
//     const [selectedClient, setSelectedClient] = useState()
//     const [name, setName] = useState('')
//     const [quartStored, setQuartStored] = useState()
//     const [clientOff, setClientOff] = useState(false)
//     const router = useRouter()

//     // Initialise React Hook Form 
//     const { register, handleSubmit, setValue, formState: { errors } } = useForm({
//         resolver: yupResolver(validationSchema)
//     })

//     useEffect(() => {
//         if (typeof window !== "undefined") { 
//             const quart = localStorage.getItem('quart')
//             const quartData = quart ? JSON.parse(quart) : []
//             setQuartStored(quartData)
//             const proIdStored = localStorage.getItem('proId')
//             if (proIdStored) setProId(proIdStored)
//         }
//     },[])

//     useEffect(() => {
//         if (proId) {
//             _readLists(proId)
//             _readServices(proId)
//             _readUsers(proId)
//             console.log('addBookingPlanning', quartStored)
//         }
//     },[proId])

//     const _handleService = (service) => {
//         setSelectedService({id:service.id, name:service.name, price:service.price, duration:service.duration})
//     }

//     const _handleClient = (client) => {
//         setSelectedClient({id:client.id, name:client.name, email:client.email})
//     }

//     const handleClearInput = () => { 
//         setName('')
//     }

//     const _convertMinutesToHours = (minutes) => {
//         const hours = Math.floor(minutes / 60)
//         const mins = minutes % 60
//         return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
//     }

//     const _handleSave = () => {

//         // PUSH DIRECT 
//         let endpoint = ""
//         let auth = ""
//         let p256dh = ""

//         users?.filter(user => user.id === selectedClient.id).map(user => {
//             endpoint = user.endpoint
//             auth = user.auth
//             p256dh = user.p256dh
//         })

//         const subscription = {
//             endpoint:endpoint,
//             keys: {
//                 auth: auth,
//                 p256dh: p256dh
//             }
//         }

//         const dataSave = {
//             date: quartStored?.date.dayInt,
//             dateString: quartStored?.date.day,
//             service:selectedService?.name,
//             serviceId:selectedService?.id,
//             price:selectedService?.price,
//             duration:parseInt(selectedService?.duration),
//             time:quartStored?.quart, 
//             timeString:_convertMinutesToHours(quartStored?.quart),
//             staffId:quartStored?.staff.id,
//             staffSurname:quartStored?.staff.surname,
//             authEmail:selectedClient?.email,
//             authId:selectedClient?.id, 
//             authName:selectedClient?.name,
//             subscription:subscription ? subscription : "",
//         }
        
//         // console.log('addBookingPlanning', dataSave)
//         _writeData(`pro/${proId}/books`, dataSave)

//         if (endpoint) {
//             _writeData(`pushToCome`, dataSave)
//         }

//         router.push('/pro/bookingPro')
//     }

//     const _handleClientOff = () => {
//         setClientOff(!clientOff)
//         setSelectedClient('')
//         setValue('nameClient', '')

//     }

//     // Function to handle form submission
//     const onSubmit = (data) => {
//         const { nameClient } = data
//         setSelectedClient({id:"Client non enregistré", name:data.nameClient, email:"Client non enregistré"})
//     }

//     return (
//         <div>

//             <HeaderCustom title="Retour" url="/pro/bookingPro" />

//             <div className="p-3">

//                 <Card>
//                     <CardContent>
//                         <div className="text-center">
//                             <div>{quartStored?.date.day}</div>
//                             <div>à {_convertMinutesToHours(quartStored?.quart)}</div>
//                             <div>avec {quartStored?.staff.surname}</div>
//                             {selectedService && 
//                                 <div className="mt-3">{selectedService?.name}</div>
//                             }
//                             {selectedClient && 
//                                 <div>{selectedClient?.name}</div>
//                             }
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {!selectedService ? 
//                     <>
//                         <div className="my-3">1 - Choisir un service</div> 

//                         {lists?.sort((a,b) => a.name.localeCompare(b.name)).map(list => (
//                             <div key={list.id}>
//                                 <div className="bg-slate-200 p-2">{list.name}</div>
//                                 {services
//                                     ?.sort((a,b) => a.name.localeCompare(b.name))
//                                     .filter(service => service[quartStored?.staff.id])
//                                     .filter(service => service.idList === list.id)
//                                     .map(service => (
//                                     <div key={service.id}>
//                                         <div className="p-2" onClick={() => _handleService(service)} style={{ cursor:"pointer" }}>{service.name}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ))} 
//                     </>
//                 :  
//                     <>

//                         {!selectedClient ? 
//                             <>
//                                 <div className="my-3">2 - Choisir un client</div>

//                                 {clientOff && 
//                                     <div>
//                                         <form onSubmit={handleSubmit(onSubmit)}>
//                                             <TextField
//                                                 label="Client non enregistré"
//                                                 className="blackTextField"
//                                                 {...register("nameClient")}
//                                                 error={!!errors.nameClient}
//                                                 helperText={errors.nameClient?.message}
//                                             />
//                                             <div className="flex gap-4">
//                                                 <button className="myButtonGrey" type="submit">Enregistrer</button>
//                                                 <button className="myButtonRed" onClick={_handleClientOff}>Annuler</button>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 }

//                                 {!clientOff && 
//                                     <>
//                                         <button className="myButtonGrey" onClick={_handleClientOff}>Client non enregistré</button>

//                                         <form className="flex flex-col gap-3 bg-white p-5 rounded-lg w-full md:w-3/4 lg:w-1/2 max-w-2xl">
//                                             <TextField
//                                                 label="Rechercher un client"
//                                                 className="blackTextField"
//                                                 {...register("name")}
//                                                 error={!!errors.name}
//                                                 helperText={errors.name?.message}
//                                                 value={name}
//                                                 onChange={(e) => setName(e.target.value)}
//                                                 InputProps={{
//                                                     endAdornment: (
//                                                         <IconButton onClick={handleClearInput}>
//                                                             <CloseIcon />
//                                                         </IconButton>
//                                                     ),
//                                                 }}
//                                             />
//                                         </form>

//                                         {users
//                                             ?.filter(user => user.name.toLowerCase().includes(name.toLowerCase().trim()) && user.status !== "pro" && user.status !== "staff")
//                                             .sort((a,b) => a.name.localeCompare(b.name))
//                                             .map(user => (
//                                             <div key={user.id}>
//                                                 <div className="p-3 border-2 mt-1" style={{ cursor:"pointer" }} onClick={() => _handleClient(user)}>{user.name}</div>
//                                             </div>
//                                         ))}
//                                     </>
//                                 }

//                             </>
//                         : 
//                             <div className="flex justify-center mt-5">
//                                 <button className="myButtonGrey" onClick={_handleSave}>Enregistrer</button>
//                             </div>
//                         }
//                     </>
//                 }

//             </div>

//             <div style={{ height:400 }} /> 

//         </div>
//     )
// }

// export default AddBookingPlanning
