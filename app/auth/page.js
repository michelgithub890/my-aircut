'use client'
import React, { useEffect, useState } from 'react'
// NEXT 
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
// ICONS 
import { IoLogOutOutline } from "react-icons/io5"
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const Auth = () => {
    const { _readUsers, users } = useFirebase()
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        _readUsers()
        console.log("auth ", status)
        if (status === "unauthenticated") {
            router.push('/auth/signin')
        }
    },[session])

    return (
        <div className="mx-5">

            <div className="flex justify-end p-2">
                <IoLogOutOutline size={25} onClick={signOut} /> 
            </div>

            {users.filter(user => user.email === session?.user?.email).map(user => (
                <div key={user.id} className="text-center text-2xl mt-5">
                    <div className="mt-5">{user.name}</div>
                    <div className="mt-5">{user.email}</div> 
                    {/* <div>mon panier</div> */}
                </div>
            ))} 

            <div className="text-center mt-5">
                <button className="myButton" onClick={signOut}>Me déconnecter</button>
            </div>

        </div>
    )
}

export default Auth
 
/*


*/