'use client'
import React, { useState, useEffect } from 'react'
// COMPONENTS 
import HeaderPro from '@/components/pro/HeaderPro'
// NEXT 
import Image from 'next/image'
// IMAGES 
import imageQRCode from '@/public/assets/images/qrcode.png' 
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const SiteWeb = () => {
    const [proId, setProId] = useState()
    const [count, setCount] = useState(0)
    const { _readProfil, profil } = useFirebase()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
            setCount(count + 1)
        }
    },[])

    useEffect(() => {
        _readProfil(proId)
    },[count])

    return (
        <div>

            <HeaderPro title="QR CODE" />

            {profil?.filter(pro => pro.proId === proId).map(pro => (
                <div className="flex justify-center mt-10" key={pro.id}>
                    <Image
                        src={`/assets/qrcodes/${pro.icon}.png`}
                        width={500}
                        height={500}
                        alt="qrcode"
                    />
                </div>
            ))}

        </div>
    )
}

export default SiteWeb
