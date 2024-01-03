'use client'
import React, { useEffect } from 'react'
// COMPONENTS 
import HeaderClients from '@/components/clients/HeaderClients'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const OpeningHours = () => {
    const { _readProfil, profil } = useFirebase()

    useEffect(() => {
        _readProfil()
    },[])

    // MULTILIGNE 
    const _convertNewLineToBreak = (str) => {
        return str.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ))
    }

    return (
        profil?.map(pro => (
            <div key={pro.id}>

                <HeaderClients title="Retour" />

                <div className="text-center text-2xl mt-8">{pro.company}</div>

                <div className="text-center mt-8 text-xl">{_convertNewLineToBreak(pro.hours)}</div>
                
            </div>
        ))
    )
}

export default OpeningHours
