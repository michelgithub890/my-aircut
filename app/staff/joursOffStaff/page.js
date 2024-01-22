'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderCustom from '@/components/pro/HeaderCustom' 
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const JoursOffStaff = () => {
    const { _readStaffs, staffs, _readDaysOff, daysOff } = useFirebase()
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
            _readDaysOff(proId)
        } 
        console.log('homeStaff', isAuth)
    },[proId])

    return (
        <div>

            <HeaderCustom title="Retour" url={"/staff/homeStaff"} /> 

            {staffs?.filter(staff => staff.id === isAuth?.staffId).map(staff => (
                <div key={staff.id}>

                    {daysOff?.sort((a, b) => a.startInt - b.startInt).filter(dayOff => dayOff.emetteur === isAuth?.staffId).map(dayOff => (
                        <div key={dayOff.id} className="border-b-2 p-3">
                            <div>
                                <div className="text-center">du {dayOff.startString}</div>
                                <div className="text-center">au {dayOff.endString}</div>
                            </div>
                        </div>
                    ))}

                </div>
            ))}

            {daysOff?.sort((a, b) => a.startInt - b.startInt).filter(dayOff => dayOff.emetteur === isAuth?.staffId).length === 0 && 
                <div className="mt-10 text-center">Pas de jours de prévus</div>
            }  

        </div>
    )
}

export default JoursOffStaff
