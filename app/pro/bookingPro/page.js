'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import { useRouter } from 'next/navigation' 
import Image from 'next/image'
import Link from 'next/link'
// MUI 
import { Divider, Typography } from '@mui/material'
// HOOKS  
import usePlanningPro from '@/hooks/usePlanningPro' 
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// REACT SLICK 
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
// COMPONENTS 
import Planning from '@/components/pro/Planning'

const BookingPro = () => {  
    const { _displayDays } = usePlanningPro()
    const { _readProfil, profil, _readBooks, books, _readStaffs, staffs, _readDaysOff, daysOff, _readHours, hours } = useFirebase()
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()
    const router = useRouter()

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
        if (proId) {
            _readProfil(proId)
            _readBooks(proId)
            _readStaffs(proId) 
            _readDaysOff(proId)
            _readHours(proId)
        }
    },[proId])

    let settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    return (
        <Slider {...settings}>
            {_displayDays(staffs, books, profil, daysOff, hours).map((item, index) => (
                <div key={`${item.day.day}_${item.staffSurname}`}> {/* Assurez-vous que item.day.id est unique */}
                    <div className="text-center mt-3">{item.day.day}</div>
                    <div className="text-center mt-2">{item.staffSurname}</div>
                    {item.hours.map((hour, hourIndex) => (
                        <div key={`${item.day.day}_${item.staffSurname}_${hour.hour || hourIndex}`}>
                            <div className={`flex items-center justify-start px-4 py-4 gap-4 ${hour.available === "hoursOff" ? "bg-sky-100" : ""}`}>
                                <div>{hour.hour}</div>
                                <div>{hour.available}</div>
                            </div>
                            <Divider light />
                        </div>
                    ))}
                </div>
            ))}
        </Slider>
    )
}

export default BookingPro

