'use client'
import React, { useEffect, useState } from 'react'
// NEXT 
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// IMAGES 
import imageDelete from '@/public/assets/images/delete.png'
import imageCaseACocher from '@/public/assets/images/caseACocher.png'
import imageCaseACocherOk from '@/public/assets/images/caseACocherOk.png'
import imageAddHours from '@/public/assets/images/addServices.png'

const daysWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

const UpdateStaff = () => {
    const { _readStaffs, staffs, _readDaysOff, daysOff, _updateData, _readHours, hours, _deleteData } = useFirebase()
    const [staffId, setStaffId] = useState()
    const [proId, setProId] = useState()
    const [valueColor, setValueColor] = useState("")
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            setStaffId(localStorage.getItem('staffId'))
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
            const themeStored = localStorage.getItem("themeColor")
            if (themeStored) {
                setValueColor(themeStored)
            } else {
                setValueColor("")
                localStorage.setItem("themeColor", "")
            }
        }
    },[])

    useEffect(() => {
        if (proId) {
            _readStaffs(proId)
            _readDaysOff(proId)
            _readHours(proId)
        }
        if (staffId) {

        }
    },[proId])

    // DELETE DAY OFF  
    const _handleDeleteDaysOff = (id) => {
        _deleteData(`pro/${proId}/daysOff/${id}`)
    }

    const _handlePutOnDay = (dayWeek) => {
        const data = {
            [dayWeek]:true
        }
        _updateData(`pro/${proId}/staff/${staffId}`, data)
    }

    const _handlePutOffDay = (dayWeek) => {
        const data = {
            [dayWeek]:false
        }
        _updateData(`pro/${proId}/staff/${staffId}`, data)
    }

    const _handleAddHours = (dayWeek) => {
        localStorage.setItem('dayWeek', dayWeek)
        router.push("/pro/staffPro/updateStaff/updateStaffHours")
    }

    const _handleDeleteHours = (id) => {
        _deleteData(`pro/${proId}/hours/${id}`)
    }

    const _convertTimeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number)
        return hours * 60 + minutes
    }

    const _handleStaffAcces = (staff) => {
        localStorage.setItem('staff', JSON.stringify(staff))
        router.push("updateStaff/createStaffAcces")
    }
 
    return (
        <div>

            <Link href={"/pro/staffPro"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            {staffs?.filter(staff => staff.id === staffId).map(staff => (
                <div key={staff.id}>

                    <div className="text-center mt-3">{staff.name} {staff.surname}</div>

                    <Link href={"/pro/staffPro/updateStaff/updateStaffServices"}>
                        <div className="border-b-2 p-3">Services</div>
                    </Link>

                    <Link href={"/pro/staffPro/updateStaff/updateStaffDaysOff"}>
                        <div className="border-b-2 p-3">Jours de fermetures</div>
                    </Link>

                    <div className="border-b-2 p-3" onClick={() => _handleStaffAcces(staff)}>Accès</div>
 
                    {daysOff?.sort((a, b) => a.startInt - b.startInt).filter(dayOff => dayOff.emetteur === staffId).map(dayOff => (
                        <div key={dayOff.id} className="border-b-2 p-3 flex justify-between items-center">
                            <div>
                                <div>du {dayOff.startString}</div>
                                <div>au {dayOff.endString}</div>
                            </div>
                            <Image 
                                src={imageDelete} 
                                className='img-fluid' alt='image services'
                                height={20}
                                width={20}
                                onClick={() => _handleDeleteDaysOff(dayOff.id)}
                            />
                        </div>
                    ))}

                    <div className="border-b-2 p-3">horaires</div>

                    {daysWeek.map(dayWeek => (
                        <div key={dayWeek}>
                            <div className="p-3 flex items-center gap-4 border-b-2">
                                <div>
                                    {staff[dayWeek] ? 
                                        <Image 
                                            src={imageCaseACocherOk} 
                                            className='img-fluid' 
                                            alt='image services' 
                                            height={20}
                                            width={20}
                                            onClick={() => _handlePutOffDay(dayWeek)}
                                        />
                                    :
                                        <Image 
                                            src={imageCaseACocher} 
                                            className='img-fluid' 
                                            alt='image services' 
                                            height={20}
                                            width={20}
                                            onClick={() => _handlePutOnDay(dayWeek)}
                                        />
                                    }
                                </div>
                                <div>{dayWeek}</div>
                            </div>

                            {staff[dayWeek] && 
                                <div className="border-b-2">
                                    <div className="flex justify-center p-2">
                                        <Image 
                                            src={`/assets/images/addServices${valueColor}.png`} 
                                            className='img-fluid' alt='image services' 
                                            style={{ cursor:"pointer" }} 
                                            height={30}
                                            width={30}
                                            onClick={() => _handleAddHours(dayWeek)}
                                        />
                                    </div>

                                    {hours?.sort((a,b) => _convertTimeToMinutes(a.start) - _convertTimeToMinutes(b.start)).filter(hour => hour.emetteur === staffId && hour.day === dayWeek).map(hour => (
                                        <div key={hour.id} className="flex justify-center items-center gap-3 p-2">
                                            <div>{hour.start}:{hour.end} {hour.startInt}</div>
                                            <Image 
                                                src={imageDelete} 
                                                className='img-fluid' alt='image services' 
                                                height={20}
                                                width={20}
                                                onClick={() => _handleDeleteHours(hour.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    ))}

             

                </div>
            ))}

            <div style={{ height:400 }} />
        
        </div>
    )
}

export default UpdateStaff
