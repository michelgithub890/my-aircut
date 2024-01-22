'use client'
import React, { useState, useEffect, useRef } from 'react'
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
    const router = useRouter()
    const sliderRef = useRef()

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

    useEffect(() => {
        const lastSlideIndex = localStorage.getItem('lastSlideIndex')
        if (lastSlideIndex !== null && sliderRef.current) {
            sliderRef.current.slickGoTo(parseInt(lastSlideIndex))
        }
    }, [])

    let settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: currentSlide => {
            localStorage.setItem('lastSlideIndex', currentSlide)
        }
    }
 
    const _handleHoursBooking = (book, quart) => {
        if (book) {
            localStorage.setItem('book', JSON.stringify(book))
            router.push("/pro/bookingPro/lookBookingPlanning")
        } 

        if (!book) {
            localStorage.setItem('quart', JSON.stringify(quart))
            router.push('/pro/bookingPro/addBookingPlanning')
            // console.log('bookingPro _handleHoursBooking', quart)
        }
    }

    return (
        <Slider  ref={sliderRef} {...settings}>
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
                                                            onClick={() => _handleHoursBooking(quart.book, quart)}
                                                        >
                                                            {/* {quart.service === "available" ? "" : quart.book.service}{quart.booùk.quart} */}
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

        </Slider>
    
    )
}

export default BookingPro

