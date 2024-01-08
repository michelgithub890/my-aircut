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
    const { _readDaysOff, daysOff, _deleteData, _readProfil, profil, _updateData } = useFirebase()
    const [proId, setProId] = useState()
    const [numberWeek, setNumberWeek] = useState(4)

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

    useEffect(() => {
        profil?.filter(pro => pro.proId === proId).map(pro => {
            setNumberWeek(pro.numberWeek ? pro.numberWeek : 4)
        })
    },[profil])

    // DELETE DAY OFF 
    const _handleDeleteDaysOff = (id) => {
        _deleteData(`pro/${proId}/daysOff/${id}`)
    }

    // SUBSTRIDE WEEK NUMBER 
    const _subsribeWeekNumber = (id) => {
        if (numberWeek > 0) {
            const data = {
                numberWeek:numberWeek- 1
            }
            _updateData(`pro/${proId}/profil/${id}`, data)
        }
    }

    // ADD WEEK NUMBER 
    const _addWeekNumber = (id) => {
        if (numberWeek < 8) {
            const data = {
                numberWeek:numberWeek + 1
            }
            _updateData(`pro/${proId}/profil/${id}`, data)
        }
    }

    return (
        <div>

            <HeaderPro title="Paramètres" />

            {profil?.filter(pro => pro.proId === proId).map(pro => (
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

                    {/* NBR WEEKS TO BOOKING */}
                    <div className="text-center mt-4">Nombre de semaines de réservations possible (max 8)</div>
                    <div className="flex justify-center p-3 items-center">
                        <div className="text-3xl me-4" onClick={() => _subsribeWeekNumber(pro.id)}>-</div>
                        <div className="text-2xl">{numberWeek}</div>
                        <div className="text-3xl ms-4" onClick={() => _addWeekNumber(pro.id)}>+</div>
                    </div>

                </div>
            ))}

            <div style={{ height:400 }} />

        </div>
    )
}

export default ParamPro
