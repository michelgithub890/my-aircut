'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderPro from '@/components/pro/HeaderPro' 
// NEXT 
import Link from 'next/link' 
import Image from 'next/image'
import { useRouter } from 'next/navigation'
// IMAGES 
import imageAddStaff from '@/public/assets/images/addStaff.png'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const StaffPro = () => { 
    const { _readStaffs, staffs } = useFirebase() 
    const [proId, setProId] = useState()
    const [count, setCount] = useState(0)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
            setCount(count + 1)
        }
    },[])

    useEffect(() => {
        _readStaffs(proId)
    },[count])

    const _handleChoiceStaff = (staffId) => {
        localStorage.setItem("staffId",(staffId))
        router.push("/pro/staffPro/updateStaff")
    }

    return (
        <div>

            <HeaderPro title="Équipe" />

            <Link href={"/pro/staffPro/addStaff"} className="flex justify-center mt-4">
                <Image 
                    src={imageAddStaff} 
                    className='img-fluid shadow-lg' 
                    priority={true} 
                    alt='image calendar' 
                    style={{ height:50, width:50 }} 
                />
            </Link>

            {staffs?.sort((a, b) => b.name.localeCompare(a.name)).map(staff => (
                <div key={staff.id} className="border-b-2 p-3" onClick={() => _handleChoiceStaff(staff.id)} style={{ cursor:"pointer" }}>
                    <div>{staff.name} {staff.surname}</div>
                </div>
            ))}

            <div style={{ height:400 }} />

        </div>
    )
}

export default StaffPro
