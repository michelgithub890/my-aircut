'use client'
import React, { useState, useEffect, useRef } from 'react'
// NEXT 
import { useRouter } from 'next/navigation' 
// ICONS 
import { IoIosArrowRoundBack } from "react-icons/io"
// HOOKS  
import usePlanningPro from '@/hooks/usePlanningPro' 
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// REACT SLICK 
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

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
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()
    const router = useRouter()
    const sliderRef = useRef()

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
        // console.log('bookingPro ', book.time ,"===", quart.quartInt)

        // si il y a une réservation 
        if (book) {
            localStorage.setItem('book', JSON.stringify(book))
            router.push("/pro/bookingPro/lookBookingPlanning")
        } 

        // si il n'y a pas de réservation et que le status est différent de staff 
        if (!book && isAuth?.status !== "staff") {
            localStorage.setItem('quart', JSON.stringify(quart))
            router.push('/pro/bookingPro/addBookingPlanning')
        }
    }

    const _handleReturn = () => {
        // local storage
        localStorage.removeItem('lastSlideIndex') 
        // is auth 
        if (isAuth?.status === "staff") {
            router.push('/staff/homeStaff')
        } else {
            router.push('/pro/homePro')
        }
    }
 
    return (
        <div>

            <div className="flex justify-start items-center gap-3 border-b-2 p-3">
                <IoIosArrowRoundBack size={"2.2rem"} onClick={_handleReturn} /> 
                <div>Retour</div>
            </div>

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
                                                        <div key={`${index}_${hourIndex}_${quartIndex}`} className="">
                                                            
                                                            <div 
                                                                className={`${quart.service === "available" ? 
                                                                    "min-h-9 border-t-2" 
                                                                : 
                                                                    `p-2 bg-orange-300 ${quart.book.duration} min-h-9`
                                                                }`}
                                                                style={{ cursor:"pointer" }}
                                                                onClick={() => _handleHoursBooking(quart.book, quart)}
                                                            >
                                                                {quart.service === "available" ? "" : 
                                                                    quart.book.time === quart.quartInt ?
                                                                    quart.book.service : ""
                                                                } 
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
            
        </div>
    
    )
}

export default BookingPro

