'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import ModalAlert from '@/components/modals/ModalAlert'
// NEXT 
import { useRouter } from 'next/navigation'
// MUI 
import { Card, CardContent } from '@mui/material'
// MODELS 
import { MODEL_COLOR } from '@/models/ModelColor'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// HOOKS 
import HeaderCustom from '@/components/pro/HeaderCustom'

const BookingClientConfirm = () => {
    const { _readBooks, books, _writeData, _readProfil, profil, _readUsers, users } = useFirebase()
    const [isAuth, setIsAuth] = useState()
    const [servicesStorage, setServicesStorage] = useState()
    const [dataBook, setDataBook] = useState()
    const [proId, setProId] = useState()
    const [openModalBooking, setOpenModalBooking] = useState(false)
    const [openModalNotAllowed, setOpenModalNotAllowed] = useState(false)
    const [valueColor, setValueColor] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            // get services storage 
            let servicesData = JSON.parse(localStorage.getItem("services"))
            // set services for show in render
            setServicesStorage(servicesData)
            const auth = localStorage.getItem("isAuth")
            const authData = auth ? JSON.parse(auth) : [] 
            setIsAuth(authData)
            let dataBookStored = JSON.parse(localStorage.getItem("dataBook"))
            setDataBook(dataBookStored)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
            const themeStored = localStorage.getItem("themeColor") 
            if (themeStored) {
                setValueColor(themeStored)
            } else {
                setValueColor("")
                localStorage.setItem("themeColor", "")
            }
        }
    },[])

    useEffect(() => {
        const auth = localStorage.getItem("isAuth")
        const authData = auth ? JSON.parse(auth) : [] 
        setIsAuth(authData)
    },[])

    useEffect(() => {
        if (proId) {
            _readBooks(proId)
            _readProfil(proId)
            _readUsers(proId)
        }
    },[proId])

    const _whoStaffAvailable = (level) =>  {
        let arrayStaffAvailable = []

        // qui sont les staff 
        if (servicesStorage[level].idStaff === "Sans préférences") {
            dataBook.arrayStaff1.map(staff => {
                let isBooking = books
                    .filter(book => book.staffId === staff.staffId)
                    .filter(book => book.date === dataBook.date)
                    .filter(book => dataBook.time <= book.time + book.duration1 - 15 && dataBook.time + parseInt(servicesStorage[level].duration) - 15 >= book.time)
                if (isBooking.length === 0) {
                    arrayStaffAvailable.push({staffId:staff.staffId, staffSurname:staff.staffSurname})
                }
            })
        }

        if (servicesStorage[level].idStaff !== "Sans préférences") {
            let isBooking = books
                .filter(book => book.staffId === servicesStorage[level].idStaff)
                .filter(book => book.date === dataBook.date)
                .filter(book => dataBook.time <= book.time + book.duration1 - 15 && dataBook.time + parseInt(servicesStorage[level].duration) - 15 >= book.time)
            if (isBooking.length === 0) {
                arrayStaffAvailable.push({
                    staffId:servicesStorage[level].idStaff, 
                    staffSurname:dataBook.arrayStaff1.filter(staff => staff.staffId === servicesStorage[level].idStaff).map(staff => staff.staffSurname)
                })
            }
        }

        const choiceStaff = arrayStaffAvailable[Math.floor(Math.random() * arrayStaffAvailable.length)]
        
        return choiceStaff
    }

    const _dataSave = (staff, level, time) => {
        
        if (isAuth.denied === true) {
            setOpenModalNotAllowed(true)
        } else {

            // PUSH DIRECT 
            let endpoint = ""
            let auth = ""
            let p256dh = ""

            users?.filter(user => user.email === isAuth.email).map(user => {
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

            let company = profil[0].company
            let title = `${company}`
            let body = `Vous avez rendez-vous le ${dataBook.dateString} à ${_convertMinutesToHHMM(time)}`

            if (subscription) {
                _sendPush(subscription, title, body)
            }

            // DATE SAVE 
            let dataSave = {
                date: dataBook.date,
                dateString: dataBook.dateString,
                service:servicesStorage[level].name,
                serviceId:servicesStorage[level].id,
                price:servicesStorage[level].price,
                time:time,
                timeString:_convertMinutesToHHMM(time),
                duration:parseInt(servicesStorage[level].duration),
                staffId:staff.staffId, 
                staffSurname:staff.staffSurname,
                authEmail:isAuth.email,
                authId:isAuth.id,
                authName:isAuth.name, 
                proId:proId,
                company:company,
                subscription:subscription,
            }

            // ECRIRE DANS BOOK LA RESERVATION 
            _writeData(`pro/${proId}/books`, dataSave) 

            // ECRIRE DANS  LA DATBASE LES PUSH A VENIR
            _writeData(`pushToCome`, dataSave)

            // EMAIL 
            _sendEmailConfirm(isAuth.name, isAuth.email, company, dataBook.dateString, _convertMinutesToHHMM(time))

            // REDIRECTION PAGE HOME CLIENT + REMOVE STORAGE 
            router.push("/clients/homeClients")
            localStorage.removeItem("dataBook")
            localStorage.removeItem("services")

            // console.log('bookingClientConfirm ', company, "-", dataSave) 
        }
    }

    const _sendEmailConfirm = async (name, email, company, date, hours) => {
        const response = await fetch('/api/email/sendMailConfirmBooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, company, date, hours }),
        })
 
        return response
    }

    const _sendPush = async (subscription, title, body) => {
        try {
            const response = await fetch('/api/push/sendPushNotification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    subscription:subscription,
                    title:title,
                    body:body,
                }),             
            })
        
            const data = await response.json()
            if (data.success) {
              console.log('Notification envoyée avec succès')
            } else {
              console.error('Erreur lors de l\'envoi de la notification')
            }
        } catch (error) {
            console.error('Erreur lors de l\'appel à l\'API', error)
        }
    }

    const _handleConfirmBooking = () => {

        if (servicesStorage.length === 1) {
            // console.log('bookingClientConfirm: ', _whoStaffAvailable(0))
            if (_whoStaffAvailable(0)) {
                _dataSave(_whoStaffAvailable(0),0,dataBook.time)
            } else {
                setOpenModalBooking(true)
            }
        }

        if (servicesStorage.length === 2) {
            // console.log('bookingClientConfirm: ', _whoStaffAvailable(0))
            if (_whoStaffAvailable(0) && _whoStaffAvailable(1)) {
                _dataSave(_whoStaffAvailable(0),0,dataBook.time)
                _dataSave(_whoStaffAvailable(1),1,dataBook.time + parseInt(servicesStorage[0].duration))
            } else {
                setOpenModalBooking(true)
            }
        }

        if (servicesStorage.length === 3) {
            // console.log('bookingClientConfirm: ', _whoStaffAvailable(0))
            if (_whoStaffAvailable(0) && _whoStaffAvailable(1) && _whoStaffAvailable(2)) {
                _dataSave(_whoStaffAvailable(0),0,dataBook.time)
                _dataSave(_whoStaffAvailable(1),1,dataBook.time + parseInt(servicesStorage[0].duration))
                _dataSave(_whoStaffAvailable(2),2,dataBook.time + parseInt(servicesStorage[0].duration) + parseInt(servicesStorage[1].duration))
            } else {
                setOpenModalBooking(true)
            }
        }

    }

    const _handleCloseModalBookingAlreadyBook = () => {
        setOpenModalBooking(false)
        setShowConfirmBooking(false)
        router.push("/clients/bookingClients")
    }

    const _convertMinutesToHHMM = (minutes) => {
        let hours = Math.floor(minutes / 60)
        let mins = minutes % 60
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }

    const _displayTime = (index) => {
        // console.log('bookingClientConfirm: ', index, dataBook.time)
        let time = ""
        if (index === 0) time = dataBook.time
        if (index === 1) time = dataBook.time + parseInt(servicesStorage[0].duration)
        if (index === 2) time = dataBook.time + parseInt(servicesStorage[1].duration) + parseInt(servicesStorage[1].duration)
        return time
    }

    const _handleCloseModalNotAllowed = () => {
        setOpenModalNotAllowed(false)
    }

    return ( 
        <div>

            <HeaderCustom title="Retour" url={"/clients/bookingClients"} /> 

            {servicesStorage && servicesStorage.map((service, index) => (
                <div key={index} className="mt-3 mx-3">
                    <div className="text-center p-3">Réservation</div>
                    <div className={`my-book${valueColor}`}>
                    {/* <Card>
                        <CardContent> */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <div>{dataBook.dateString} à {_convertMinutesToHHMM(_displayTime(index))}</div>
                                    <div>Coupe: {service.name}</div>
                                    <div>{servicesStorage[index].duration}min - {servicesStorage[index].price}€</div>
                                    <div>Avec {servicesStorage[index].idStaff === "Sans préférences" ? 
                                        "Sans préférences" 
                                        : dataBook.arrayStaff1.filter(staff => staff.staffId === servicesStorage[index].idStaff).map(staff => staff.staffSurname)}</div>
                                </div>
                            </div>
                        {/* </CardContent>
                    </Card> */}
                    </div>
                </div>
            ))}

            <div className="flex justify-center gap-3 mt-3">
                <button className="myButtonGrey" onClick={_handleConfirmBooking}>Confirmer</button>
            </div>

            <div style={{ height:400 }} />

            <ModalAlert 
                title={"Oups, le créneau est déjà pris. Veuillez séléctionner un nouveau créneau"}
                handleClose={_handleCloseModalBookingAlreadyBook}
                open={openModalBooking}
            />

            <ModalAlert 
                title={"La réservation en ligne n'est pas disponible."}
                handleClose={_handleCloseModalNotAllowed}
                open={openModalNotAllowed}
            />


        </div>
    )
}

export default BookingClientConfirm
