'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import { useRouter } from 'next/navigation' 
import Image from 'next/image'
import Link from 'next/link'
// IMAGES 
import { IoMdLogOut } from "react-icons/io"
import imageCalendar from '@/public/assets/images/calendargif.gif'
import imageHoraires from '@/public/assets/images/horaires.png' 
import imageParametre from '@/public/assets/images/parametre.png'

const HomeStaff = () => {
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

    const _handleLogOut = () => {
        localStorage.removeItem('isAuth')
        router.replace("/")
    }

    useEffect(() => {
        isAuth && console.log('homeStaff ', isAuth.status)
    },[isAuth])

    return (
        <div>

            <div className="flex justify-end items-center gap-3 border-b-2 p-3">
                <div>{isAuth?.surname}</div>
                <IoMdLogOut size={"2.2rem"} onClick={_handleLogOut} />
            </div>

            <div className="mt-3" />

            {/* CARD CALENDAR */}
            <Link href={"/pro/bookingPro"}>
                <div className='flex justify-center' >
                    <div className='w-full mx-2 p-2 rounded-lg shadow-xl'>
                        <div className='flex justify-center'>
                            <Image src={imageCalendar} priority={true} className='img-fluid' alt='image calendar' style={{ height:50, width:50 }} />
                        </div>
                        <div className='text-center' style={{fontSize:12}}>PLANNING</div>
                    </div> 
                </div>
            </Link>

            <div className="flex justify-around mt-4">
                <Link href={"/staff/hoursStaff"} className="w-2/4 ms-2 p-2 rounded-lg shadow-xl">
                    <div className="flex justify-center"> 
                        <Image src={imageHoraires} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>HORAIRES</div>
                </Link>
                <Link href={"/staff/joursOffStaff"} className="w-2/4 me-2 p-2 rounded-lg shadow-xl">
                    <div className="flex justify-center"> 
                        <Image src={imageParametre} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>JOURS OFF</div>
                </Link>
            </div>

        </div>
    )
} 

export default HomeStaff
