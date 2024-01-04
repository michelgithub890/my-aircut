'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderClients from '@/components/clients/HeaderClients'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// NEXT 
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const ProfilClients = () => {
    const { _readUsers, users } = useFirebase()
    const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'))
    const [proId, setProId] = useState(localStorage.getItem('proId'))
    const [isMonted, setIsMonted] = useState(false)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        setIsMonted(true)
    },[]) 

    useEffect(() => {
        if (isMonted && !isAuth) {
            router.push("/clients/homeClients")
        }
        _readUsers(proId)
    },[isMonted])

    const _handleSignOut = () => {
        signOut()
    }

    return (
        <div>
            
            <HeaderClients title="Retour" />

            {users?.filter(user => user.email === session?.user.email).map(user => (
                <div key={user.id} className="text-center mt-6">
                    <div>{user.name}</div>
                    <div>{user.email}</div>
                </div>
            ))}

            <div className="flex justify-center mt-10">
                <button className="myButton" onClick={_handleSignOut}>Se deconnecter</button>
            </div>

            <div style={{ height:400 }} />

        </div>
    )
}

export default ProfilClients
