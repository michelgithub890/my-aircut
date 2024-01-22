'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import { useRouter } from 'next/navigation' 
import Image from 'next/image'
import Link from 'next/link'
// MUI 
import { Divider, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
// HOOKS  
import usePlanningPro from '@/hooks/usePlanningPro' 
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// REACT SLICK 
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import ModalBookingSelected from '@/components/modals/ModalBookingSelected'
import ModalAddBooking from '@/components/modals/ModalAddBooking'
// COMPONENTS 

const BookingPro = () => {  
    const { _displayDays } = usePlanningPro()
    const { 
        _readProfil, 
        profil, 
        _readBooks, 
        books, 
        _readStaffs, 
        staffs, 
        _readDaysOff, 
        daysOff, 
        _readHours, 
        hours, 
        _deleteData, 
        _readServices, 
        services,
        _readLists,
        lists
    } = useFirebase()
    // const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()
    const [modalBookingSelected, setModalBookingSelected] = useState(false)
    const [bookSelected, setBookSelected] = useState()
    const [confirmBooking, setConfirmBooking] = useState(false)
    const [modalAddBooking, setModalAddBooking] = useState(false)
    const [serviceSelected, setServiceSelected] = useState()
    const [staffSelected, setStaffSelected] = useState()
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") { 
            // const auth = localStorage.getItem('isAuth')
            // const authData = auth ? JSON.parse(auth) : []
            // setIsAuth(authData)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        if (proId) {
            _readProfil(proId)
            _readBooks(proId)
            _readStaffs(proId) 
            _readDaysOff(proId)
            _readHours(proId)
            _readServices(proId)
            _readLists(proId)
        }
    },[proId])

    let settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    const _openModalBookingSelected = (book, hourDay) => {
        if (book) {
            console.log(`bookingPro _handleTest ${book}`, book)
            setBookSelected(book)
            setModalBookingSelected(true)
        } else if (hourDay) {
            console.log(`bookingPro _handleTest ${hourDay}`, hourDay.staff.id)
            setModalAddBooking(true)
            setStaffSelected({staffId:hourDay.staff.id, staffSurname:hourDay.staff.surname})
        }
    }

    const _handleClose = () => {
        setModalBookingSelected(false)
        setConfirmBooking(false)
    }

    const _handleConfirmBooking = () => {
        setConfirmBooking(true)
    }
 
    const _handleDeleteBooking = (id) => {
        _deleteData(`pro/${proId}/books/${id}`)
        setModalBookingSelected(false)
        setConfirmBooking(false)
    }

    const _handleCloseAddBooking = () => {
        setModalAddBooking(false)
    }

    const _handleAddBooking = () => {
        setModalAddBooking(false)
    }

    const _handleSelectBooking = (service) => {
        console.log(`bookingPro _handleSelectBooking`, service.id)
        setServiceSelected(service.id)
    }

    const _handleCancelBooking = () => {
        setServiceSelected()
    }

    return (
        <Slider {...settings}>
            {_displayDays(staffs, books, profil, daysOff, hours).map((item, index) => (
                <div key={`${index}`}> {/* Assurez-vous que item.day.id est unique */}

                    <div className="text-center mt-3">{item.day.day}</div>
                    <div className="text-center mt-2 mb-5">{item.staffSurname}</div>

                    {item.hours.map((hourDay, hourIndex) => (

                        <div key={`${index}_${hourIndex}`}>

                            {hourDay.dayOff ?  

                                <div className="text-center p-5">Day off</div>  
                            : 

                                <div className="flex">

                                    <div className={`text-center w-2/12 ${hourDay.hour.hour === "quartHour" ? "min-h-2" : ""}`}>
                                        {hourDay.hour.hour !== "quartHour" &&  hourDay.hour.hour}
                                    </div>

                                    <>
                                        {hourDay.available === "hoursOff" ? <div className="bg-slate-300 w-10/12" /> : 
                                            <div className="w-10/12">
                                                {hourDay.arrayQuart.map((quart, quartIndex) => (
                                                    <div key={`${index}_${hourIndex}_${quartIndex}`} className="border-t-2">
                                                        
                                                        <div 
                                                            className={`${quart.service === "available" ? "min-h-9" : "p-2"}`}
                                                            style={{ cursor:"pointer" }}
                                                            onClick={() => _openModalBookingSelected(quart.book, hourDay)}
                                                        >
                                                            {quart.service === "available" ? "" : quart.book.service}
                                                        </div>
                                                        
                                                    </div>
                                                ))}

                                            </div>
                                        }
                                    </>

                                </div>
                            }

                        </div>

                    ))}

                </div>
            ))}

            <ModalBookingSelected 
                handleClose={_handleClose} 
                open={modalBookingSelected}
                bookSelected={bookSelected}
                confirmBooking={confirmBooking}
                _handleConfirmBooking={_handleConfirmBooking}
                _handleDeleteBooking={_handleDeleteBooking}
            />

            <ModalAddBooking
                handleClose={_handleCloseAddBooking} 
                services={services}
                lists={lists}
                open={modalAddBooking}
                _handleAddBooking={_handleAddBooking}
                setServiceSelected={setServiceSelected}
                serviceSelected={serviceSelected}
                _handleSelectBooking={_handleSelectBooking}
                _handleCancelBooking={_handleCancelBooking}
                staffSelected={staffSelected}
            />

        </Slider>
    
    )
}

export default BookingPro

