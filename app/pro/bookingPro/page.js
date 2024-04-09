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
// MUI 
import { Divider } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'


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
 
    const _handleHoursBooking = (day,hourDay,staffHours) => {
        // console.log('bookingPro ', book.time ,"===", quart.quartInt)

        if (staffHours.available === "occuped") {
            localStorage.setItem('book', JSON.stringify(staffHours.book))
            router.push("/pro/bookingPro/lookBookingPlanning")
        }

        if (staffHours.available === "on") {

            // éléments du quart 
            const data = {
                dayInt:day.dayInt,
                day:day.day,
                staff:staffHours.staff, 
                quart:staffHours.quart
            }

            // console.log('bookingPro ', data)
            localStorage.setItem('quart', JSON.stringify(data))
            router.push('/pro/bookingPro/addBookingPlanning')

        }

        // si il y a une réservation 
        // if (book) {
        //     localStorage.setItem('book', JSON.stringify(book))
        //     router.push("/pro/bookingPro/lookBookingPlanning")
        // } 

        // // si il n'y a pas de réservation et que le status est différent de staff 
        // if (!book && isAuth?.status !== "staff") {
        //     localStorage.setItem('quart', JSON.stringify(quart))
        //     router.push('/pro/bookingPro/addBookingPlanning')
        // }
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

                        {/* <div className="text-center mt-3">{item.day.day}</div> */}
                        <div className="text-center mt-3">{item.date.day}</div>
                        <div className="text-center mt-2 mb-5">{item.staffSurname}</div>

                        <div>{item.planning.map((hourDay,planningIndex) => (
                            <div key={`${index}_${planningIndex}`}>
                                {/* <Divider sx={{ marginLeft: `${hourDay.hour !== 15 && hourDay.hour !== 30 && hourDay.hour !== 45 ? '0px' : '50px'}` }} /> */}
                                <div className="flex">
                           
                                    <div className="w-2/12 text-end">
                                        {/* <Divider sx={{ marginLeft: `${hourDay.hour !== 15 && hourDay.hour !== 30 && hourDay.hour !== 45 ? '0px' : '50px'}` }} /> */}
                                
                                        {/* <div className="pe-4 pt-2" style={{ fontSize:10 }}>{hourDay.hour}</div>  */}
                                        <div 
                                            className="pe-4" 
                                            style={{ 
                                                fontSize:hourDay.hour !== 15 && hourDay.hour !== 30 && hourDay.hour !== 45 ? 10 : 8, 
                                                marginTop:hourDay.hour !== 15 && hourDay.hour !== 30 && hourDay.hour !== 45 ? -8 : -6 
                                            }}
                                        >{hourDay.hour}</div> 
                                    </div>

                                    <div className="flex justify-between w-10/12 h-7">
                                        {hourDay.array2.map((staffHours, staffHoursIndex) => (
                                            <div 
                                                key={`${index}_${planningIndex}_${staffHoursIndex}`} 
                                                onClick={() => _handleHoursBooking(item.date,hourDay,staffHours)}
                                                className={`
                                                    flex-1 
                                                    mx-1
                                                    border-l-2
                                                    ${staffHours.available === "off" && "bg-slate-100"}
                                                    ${staffHours.available === "occuped" && "bg-orange-400"}
                                                    ${staffHours.design === "start" && "rounded-t-sm mt-1"}
                                                    ${staffHours.design === "end" && "rounded-b-sm"}
                                                    ${staffHours.design === "start_end" && "rounded-sm mt-1"}
                                                `}
                                                style={staffHours.available !== "off" ? { cursor: "pointer" } : {}}
                                            >
                                                {staffHours.available === "on" && <Divider />}
                                                <div className='ps-2 pt-1' style={{ fontSize:10 }}>
                                                    {staffHours.design === "start_end" && staffHours.book?.service?.slice(0, 10)}
                                                    {staffHours.design === "start" && staffHours.book?.service?.slice(0, 10)}
                                                </div>  
                                            </div>
                                        ))}
                                    </div>

                                </div>

                            </div>

                        ))}</div>

                    </div>
                ))}

            </Slider>
            
        </div>
    
    )
}

export default BookingPro


/*

                        {item.hours.map((hourDay, hourIndex) => ( 

                            <div key={`${index}_${hourIndex}`}>

                                {hourDay.dayOff ?  

                                    <div className="text-center p-5">Day off</div>  
                                : 

                                    <div className="flex">

                                        <div className={`text-center w-2/12 ${hourDay.hour.hour === "quartHour" ? "min-h-2" : ""}`}>
                                            {hourDay.hour.hour !== "quartHour" &&  hourDay.hour.hour}
                                        </div> 

                                        <div className="w-2/12 text-end">
                                            <div 
                                                className="pe-4" 
                                                style={{ 
                                                    fontSize:hourDay.hour !== 15 && hourDay.hour !== 30 && hourDay.hour !== 45 ? 10 : 8, 
                                                    marginTop:hourDay.hour !== 15 && hourDay.hour !== 30 && hourDay.hour !== 45 ? -8 : -6 
                                                }}
                                            >{hourDay.hour}</div> 
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

*/