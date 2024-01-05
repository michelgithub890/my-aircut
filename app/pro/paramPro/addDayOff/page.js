'use client'
import React, { useState, useEffect } from 'react'
// DATE PICKER 
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
// DATE FNS 
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
// NEXT  
import { useRouter } from 'next/navigation' 
import Link from 'next/link' 
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
registerLocale('fr', fr)

const AddDayOff = () => {
    const { _writeData } = useFirebase()
    const [valueStart, setValueStart] = useState(new Date())
    const [valueEnd, setValueEnd] = useState(new Date())
    const [proId, setProId] = useState()
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    const _handleSaveDates = () => {
        // convert date to int 
        const startInt = new Date(valueStart).getTime()
        const endInt = new Date(valueEnd).getTime()
        // convert date to string 
        const startString = format(new Date(valueStart), "eeee dd MMMM yyyy", { locale:fr })
        const endString = format(new Date(valueEnd), "eeee dd MMMM yyyy", { locale:fr })
    
        // Vérifiez si les dates de début et de fin sont définies
        if (valueStart && valueEnd) {
            // Vérifiez si la date de fin est égale ou postérieure à la date de début
            if (startInt > endInt) {
                alert("La date de fin doit être égale ou postérieure à la date de début.")
                return
            }
    
            // Si tout est correct, enregistrez les données
            const data = {
                startInt,
                endInt,
                emetteur: "pro",
                startString,
                endString,
            }
            // console.log("addDayOff _handleSaveDate ", data)
            _writeData(`pro/${proId}/daysOff`, data)
            router.push("/pro/paramPro")
        } else {
            alert("Vous devez renseigner une date de début et une date de fin.")
        }
    };
    

    return (
        <div>

            <Link href={"/pro/paramPro"}>
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
                    minDate={new Date()}
                />
            </div> 

            <div className="flex justify-center mt-4">
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    className="text-center form-control border-0 rounded-pill shadow p-2 ms-2"
                    locale="fr"
                    selected={valueEnd}
                    onChange={(date) => setValueEnd(date)}
                    minDate={new Date()}
                />
            </div>       

            <div className="flex justify-center">
                <button className="myButton" onClick={_handleSaveDates}>Enregistrer</button>
            </div>

            <div style={{ height:400 }} />
        
        </div>
    )
}

export default AddDayOff
