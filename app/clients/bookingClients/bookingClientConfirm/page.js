'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import ModalAlert from '@/components/modals/ModalAlert'
// NEXT 
import { useRouter } from 'next/navigation'
// MUI 
import { Card, CardContent } from '@mui/material'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// HOOKS 
import HeaderCustom from '@/components/pro/HeaderCustom'

const BookingClientConfirm = () => {
    const { _readBooks, books, _writeData } = useFirebase()
    const [isAuth, setIsAuth] = useState()
    const [servicesStorage, setServicesStorage] = useState()
    const [dataBook, setDataBook] = useState()
    const [proId, setProId] = useState()
    const [openModalBooking, setOpenModalBooking] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            // get services storage 
            let servicesData = JSON.parse(localStorage.getItem("services"))
            // set services for show in render
            setServicesStorage(servicesData)
            let dataBookStored = JSON.parse(localStorage.getItem("dataBook"))
            setDataBook(dataBookStored)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
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
        }
        _writeData(`pro/${proId}/books`, dataSave)
        router.push("/clients/homeClients")
        localStorage.removeItem("dataBook")
        localStorage.removeItem("services")
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

    return ( 
        <div>

            <HeaderCustom title="Retour" url={"/clients/bookingClients"} />

            {servicesStorage && servicesStorage.map((service, index) => (
                <div key={index} className="mt-3 mx-3">
                    <div className="text-center p-3">Réservation</div>
                    <Card>
                        <CardContent>
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
                        </CardContent>
                    </Card>
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

        </div>
    )
}

export default BookingClientConfirm
