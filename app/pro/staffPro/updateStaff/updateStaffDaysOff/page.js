'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// DATE PICKER 
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css" 
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
dayjs.locale('fr')
// FIREBASE
import useFirebase from '@/firebase/useFirebase'
// DATE FNS 
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
registerLocale('fr', fr)

const UpdateStaffDaysOff = () => {
    const { _writeData } = useFirebase() 
    const [valueStart, setValueStart] = useState(new Date())
    const [valueEnd, setValueEnd] = useState(new Date())
    const [staffId, setStaffId] = useState()
    const router = useRouter()

    useEffect(() => {
        setStaffId(localStorage.getItem('staffId'))
    },[])

    const _handleSaveDates = () => {
        // Obtenez la date actuelle sans heure
        const today = dayjs().startOf('day')

        const startInt = new Date(valueStart).getTime()
        const endInt = new Date(valueEnd).getTime()
        const startString = format(new Date(valueStart), "eeee dd MMMM yyyy", { locale:fr })
        const endString = format(new Date(valueEnd), "eeee dd MMMM yyyy", { locale:fr })
    
        // Vérifiez si les dates de début et de fin sont définies
        if (valueStart && valueEnd) {
            // Convertissez les valeurs en objets dayjs pour les comparer
            const startDate = dayjs(valueStart)
            const endDate = dayjs(valueEnd)
    
            // Vérifiez si la date de début est antérieure à aujourd'hui
            if (startDate.isBefore(today)) { 
                alert("La date de début ne doit pas être antérieure à aujourd'hui.")
                return
            }
    
            // Vérifiez si la date de fin est égale ou postérieure à la date de début
            if (startDate.isAfter(endDate)) {
                alert("La date de fin doit être égale ou postérieure à la date de début.")
                return
            }
    
            // Si tout est correct, enregistrez les données
            const data = {
                startInt,
                endInt,
                emetteur: staffId,
                startString,
                endString,
            }
            _writeData(`daysOff`, data)
            router.push("/pro/staffPro/updateStaff")
        } else {
            alert("Vous devez renseigner une date de début et une date de fin.")
        }
    }

    return (
        <div>

            <Link href={"/pro/staffPro/updateStaff"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            <div className="text-center mt-3">Ajouter des dates de fermetures</div>

            <div className="flex justify-center mt-4">
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    className="text-center form-control border-0 rounded-pill shadow p-2 ms-2"
                    locale="fr"
                    selected={valueStart}
                    onChange={(date) => setValueStart(date)}
                />
            </div>

            <div className="flex justify-center mt-4">
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    className="text-center form-control border-0 rounded-pill shadow p-2 ms-2"
                    locale="fr"
                    selected={valueEnd}
                    onChange={(date) => setValueEnd(date)}
                />
            </div>

            <div className="flex justify-center">
                <button className="myButton" onClick={_handleSaveDates}>Enregistrer</button>
            </div>

        </div>
    )
}

export default UpdateStaffDaysOff