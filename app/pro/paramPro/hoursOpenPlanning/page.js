'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// MUI 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// COMPONENTS 
import ModalAlert from '@/components/modals/ModalAlert'

const HoursOpenPlanning = () => {
    const { _updateData, _readProfil, profil } = useFirebase()
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [titleModal, setTilteModal] = useState("")
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
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
        _readProfil(proId)
    },[count])

    const _handleSaveDates = () => {

        if (startTime && endTime) {
            // Convertissez les heures au format 'HH:mm'
            const formattedStartTime = dayjs(startTime).format('HH:mm')
            const formattedEndTime = dayjs(endTime).format('HH:mm')
    
            // Vérifiez si l'heure de fin est supérieure à l'heure de début
            if (dayjs(endTime).isAfter(startTime)) {
                const data = {
                    hoursStartPlanning: formattedStartTime,
                    hoursEndPlanning: formattedEndTime
                }
                const id = profil[0].id
                _updateData(`pro/${proId}/profil/${id}`, data)
                router.push("/pro/paramPro")
                // Redirection ou autres traitements
            } else {
                setTilteModal("L'heure de fin doit être supérieure à l'heure de début.")
                handleClickOpen()
            }
        } else {
            setTilteModal("Veuillez sélectionner des heures de début et de fin.")
            handleClickOpen()
        }
    }

    const handleClickOpen = () => {
        setOpenModalConfirm(true)
    }
    
    const handleClose = () => {
        console.log('test handleClose')
        setOpenModalConfirm(false)
    }

    return (
        <div>

            <Link href={"/pro/paramPro"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            <div className="text-center mt-3">Ajouter les horaires du planning</div>

            <div className="flex justify-center mt-5">
                <form className="mx-10">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker 
                            label="Heure de debut" 
                            value={startTime}
                            onChange={setStartTime}
                            minutesStep={15}
                            ampm={false}
                        />
                        <div style={{ height:20 }} />
                        <TimePicker 
                            label="Heure de fin"
                            value={endTime}
                            onChange={setEndTime}
                            minutesStep={15}
                            ampm={false}
                        />
                    </LocalizationProvider>
                </form>

            </div>
        
            <div className="flex justify-center mt-3">
                <button onClick={_handleSaveDates} className="myButton">Enregistrer</button>
            </div>

            <ModalAlert handleClose={handleClose} open={openModalConfirm} title={titleModal} />

        </div> 
    )
}

export default HoursOpenPlanning
