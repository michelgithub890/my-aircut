'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderPro from '@/components/pro/HeaderPro'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// IMAGES 
import imageAdd from '@/public/assets/images/addServices.png'
import imageDelete from '@/public/assets/images/delete.png'
// NEXT 
import Image from 'next/image'
import Link from 'next/link' 

const ParamPro = () => {
    const { _readDaysOff, daysOff, _deleteData, _readProfil, profil } = useFirebase()
    const [proId, setProId] = useState()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[]) 

    useEffect(() => {
        if (proId) {
            _readDaysOff(proId)
            _readProfil(proId)
        }
    },[proId])

    // DELETE DAY OFF 
    const _handleDeleteDaysOff = (id) => {
        _deleteData(`pro/${proId}/daysOff/${id}`)
    }

    return (
        <div>

            <HeaderPro title="Paramètres" />

            {profil?.map(pro => (
                <div key={pro.id}>
                    <div className="border-b-2 p-3 mt-3">
                        <div className="flex justify-center gap-4 items-center p-3">
                            <div className='text-center'>Jours de fermetures</div>
                            <Link href={"/pro/paramPro/addDayOff"} className="flex justify-center">
                                <Image src={imageAdd} className='img-fluid' alt='image services' style={{ height:30, width:30 }} />
                            </Link>
                        </div>
                    </div>

                    {daysOff?.sort((a,b) => a.startInt - b.startInt).filter(dayOff => dayOff.emetteur === "pro").map(dayOff => (
                        <div key={dayOff.id} className="border-b-2 p-3 flex justify-between items-center">
                            <div>
                                <div>du {dayOff.startString}</div>
                                <div>au {dayOff.endString}</div>
                            </div>
                            <Image 
                                src={imageDelete} 
                                className='img-fluid' alt='image services' 
                                style={{ height:20, width:20 }} 
                                onClick={() => _handleDeleteDaysOff(dayOff.id)}
                            />
                        </div>
                    ))}

                    <div className="text-center border-b-2 p-3 flex justify-center items-center gap-4">
                        <div>Horaires du planning</div>
                        <Link href={"/pro/paramPro/hoursOpenPlanning"} className="flex justify-center">
                            <Image src={imageAdd} className='img-fluid' alt='image services' style={{ height:30, width:30 }} />
                        </Link>
                    </div>

                    <div className="border-b-2 p-3 text-center">de {pro.hoursStartPlanning} à {pro.hoursEndPlanning}</div>

                </div>
            ))}

            <div style={{ height:400 }} />

        </div>
    )
}

export default ParamPro
