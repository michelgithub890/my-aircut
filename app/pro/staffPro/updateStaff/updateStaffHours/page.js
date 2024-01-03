'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// MUI 
import TextField from '@mui/material/TextField'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const UpdateStaffHours = () => {
    const { _writeData } = useFirebase()
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [staffId, setStaffId] = useState()
    const [dayWeek, setDayWeek] = useState()
    const router = useRouter()

    useEffect(() => {
        setStaffId(localStorage.getItem('staffId'))
        setDayWeek(localStorage.getItem('dayWeek'))
    },[])

    const handleSubmit = (e) => {
        e.preventDefault()
        // Traitez ici les heures de début et de fin, par exemple en les envoyant à un serveur ou en les affichant
        console.log('Heure de début:', startTime)
        console.log('Heure de fin:', endTime)
    }

    const _handleSaveDates = () => {

        if (startTime && endTime) {
            // Convertissez les heures au format 'HH:mm'
            const formattedStartTime = dayjs(startTime).format('HH:mm')
            const formattedEndTime = dayjs(endTime).format('HH:mm')
    
            // Vérifiez si l'heure de fin est supérieure à l'heure de début
            if (dayjs(endTime).isAfter(startTime)) {
                const data = {
                    start: formattedStartTime,
                    end: formattedEndTime,
                    day:dayWeek,
                    emetteur:staffId
                }
                _writeData(`hours/`, data)
                router.push("/pro/staffPro/updateStaff")
                // Redirection ou autres traitements
            } else {
                alert("L'heure de fin doit être supérieure à l'heure de début.")
            }
        } else {
            alert("Veuillez sélectionner des heures de début et de fin.")
        }
    }

    return (
        <div>

            <Link href={"/pro/staffPro/updateStaff"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            <div className="text-center mt-3">Ajouter des horaires</div>

            <div className="flex justify-center mt-5">
                <form onSubmit={handleSubmit} className="mx-10">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['TimePicker']}>

                            <TimePicker 
                                label="Heure de debut" 
                                value={startTime}
                                onChange={setStartTime}
                                minutesStep={15}
                                ampm={false}
                            />

                        </DemoContainer>
                        <div style={{ height:20 }} />
                        <DemoContainer components={['TimePicker']}>

                            <TimePicker 
                                label="Heure de fin"
                                value={endTime}
                                onChange={setEndTime}
                                minutesStep={15}
                                ampm={false}
                            />

                        </DemoContainer>
                    </LocalizationProvider>
                </form>

            </div>
        
            <div className="flex justify-center mt-3">
                <button onClick={_handleSaveDates} className="myButton">Enregistrer</button>
            </div>

        </div>
    )
}

export default UpdateStaffHours
