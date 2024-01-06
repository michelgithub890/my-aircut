'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderClients from '@/components/clients/HeaderClients'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// NEXT 
import { useRouter } from 'next/navigation'

const ProfilClients = () => {
    const { _readUsers, users } = useFirebase()
    const [isAuth, setIsAuth] = useState("")
    const [proId, setProId] = useState("")
    const [isMonted, setIsMonted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setIsMonted(true)
        if (typeof window !== "undefined") {
            const auth = localStorage.getItem('isAuth')
            const authData = auth ? JSON.parse(auth) : null
            setIsAuth(authData);
    
            const storedProId = localStorage.getItem('proId')
            if (storedProId) setProId(storedProId)
        }
    },[]) 

    useEffect(() => {
        if (proId) {
            _readUsers(proId)
        }
    },[proId])

    const _handleSignOut = () => {
        localStorage.removeItem('isAuth')
        router.push("/clients/homeClients")
    }

    return (
        <div>
            
            <HeaderClients title="Retour" />

            {isAuth && users?.filter(user => user.email === isAuth?.email).map(user => (
                <div key={user.id} className="text-center mt-6">
                    <div>{user.name}</div>
                    <div>{user.email}</div>
                </div>
            ))}

            <div className="flex justify-center mt-10">
                <button className="myButtonGrey" onClick={_handleSignOut}>Se deconnecter</button>
            </div>

            <div style={{ height:400 }} />

        </div>
    )
}

export default ProfilClients
