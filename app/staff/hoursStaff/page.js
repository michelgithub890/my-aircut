'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderCustom from '@/components/pro/HeaderCustom' 
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const daysWeek = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"]

const HoursStaff = () => {
    const { _readStaffs, staffs, _readHours, hours } = useFirebase()
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()

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
            _readStaffs(proId)
            _readHours(proId)
        } 
        console.log('homeStaff', isAuth)
    },[proId])

    const _convertTimeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number)
        return hours * 60 + minutes
    }

    return (
        <div>

            <HeaderCustom title="Retour" url={"/staff/homeStaff"} />

            {staffs?.filter(staff => staff.id === isAuth?.staffId).map(staff => (
                <div key={staff.id}>

                {daysWeek.map(dayWeek => (
                    <div key={dayWeek}>

                    {staff[dayWeek] ? 
                        <div>
                            <div className="text-center mt-4">{dayWeek}</div>
                            {hours
                                ?.sort((a,b) => _convertTimeToMinutes(a.start) - _convertTimeToMinutes(b.start))
                                .filter(hour => hour.emetteur === isAuth?.staffId && hour.day === dayWeek)
                                .map(hour => (
                                    <div key={hour.id} className="text-center">de {hour.start} à {hour.end}</div>
                                ))}
                        </div>
                    : 
                        <div className="text-center mt-4">{dayWeek}: non travaillé</div>
                    }

                    </div>
                ))}

                </div>
            ))}

            <div style={{ height:400 }} />

        </div>
    )
}

export default HoursStaff
