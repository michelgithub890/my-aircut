'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderCustom from '@/components/pro/HeaderCustom'
// NEXT 
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// IMAGES 
import imageReset from '@/public/assets/images/reset.png'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// MUI 
import Switch from '@mui/material/Switch'
// IMAGES 
import { IoIosArrowDown } from "react-icons/io"
import { IoIosArrowUp } from "react-icons/io"

const ClientSingle = () => {
    const { _readUsers, users, _updateData } = useFirebase()
    const [userSelected, setUserSelected] = useState()
    const [numberCard, setNumberCard] = useState(0)
    const [checked, setCheched] = useState(true)
    const [showHistoryBooking, setShowHistoryBooking] = useState(false)
    const [proId, setProId] = useState()
    const [valueColor, setValueColor] = useState("")
    const router = useRouter()
 
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user")
            const parsedUserData = userData ? JSON.parse(userData) : null
            setUserSelected(parsedUserData)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
            const themeStored = localStorage.getItem("themeColor")
            if (themeStored) {
                setValueColor(themeStored)
            } else {
                setValueColor("")
                localStorage.setItem("themeColor", "")
            }
        }
    },[])

    useEffect(() => {
        if (proId) {
            _readUsers(proId)
        }
    },[proId])

    useEffect(() => {
        setNumberCard(userSelected?.fidelityCard ? userSelected.fidelityCard : 0)
        setCheched(userSelected?.denied ? false : true)
        
    },[userSelected])

    // SWITCH ACCESS BOOKING 
    const _handleChangeSwitch = () => {
        setCheched(!checked)
        const data = {
            denied:checked
        }
        _updateData(`pro/${proId}/users/${userSelected.id}`, data)
    }

    // SUBSCTRICT NUMBER CARD FIDELITY 
    const _handleSubstract = () => {
        if (numberCard > 0) setNumberCard(numberCard - 1)
        const data = {
            fidelityCard:numberCard - 1
        }
        _updateData(`pro/${proId}/users/${userSelected.id}`, data)
    }

    // ADD NUMBER CARD FIDELITY 
    const _handleAdd = () => {
        if (numberCard >= 0) setNumberCard(numberCard + 1)
        const data = {
            fidelityCard:numberCard + 1
        }
        _updateData(`pro/${proId}/users/${userSelected.id}`, data)
    }

    // RETURN 0 TO NUMBER CARD FIDELITY 
    const _handleDeleteNumberCard = () => {
        setNumberCard(0)
        const data = {
            fidelityCard:0
        }
        _updateData(`pro/${proId}/users/${userSelected.id}`, data)
    }

    const _handleMessages = () => {
        localStorage.setItem('url', "/pro/clientsPro/clientSingle")
        router.push("/pro/chatPro/chatSingle")
    }

    return (  
        <div>

            {users.filter(user => user.id === userSelected.id).map(user => (
                <div key={user.id}>

                    <HeaderCustom title={user.name} url="/pro/clientsPro" />

                    {/* FIDELITY CARD */}
                    <div className="border border-spacing-10 pb-4 m-5">
                        <div className="flex justify-center items-center gap-5 mt-5">
                            <div>CARTE DE FIDÉLITÉ</div>
                            <div onClick={_handleDeleteNumberCard}>
                                <Image src={`/assets/images/reset${valueColor}.png`} className='img-fluid' alt='image services' height={30} width={30} />
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 items-center">
                            <div onClick={_handleSubstract} className="text-3xl">-</div>
                            <div className="text-4xl">{numberCard}</div>
                            <div onClick={_handleAdd} className="text-3xl">+</div>
                        </div>
                    </div>

                    <div className="border-b-2 p-3">BOOKING TO COME</div>

                    <div className="border-b-2 p-3" onClick={_handleMessages} style={{ cursor:"pointer" }}>Messages</div> 
                    
                    {/* ACCESS BOOKING TRUE / FALSE */}
                    <div className="flex items-center p-3 gap-5 border-b-2"> 
                        <Switch
                            checked={checked}
                            onChange={_handleChangeSwitch} 
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <div className={`${checked ? "" : "text-red-600"}`}>
                            {checked ? "Réservations acceptées" : "Réservations bloquées"} 
                        </div>
                    </div>

                    {/* UPDATE CLIENT */}
                    <Link href={"/pro/clientsPro/clientSingle/updateClient"} className="flex items-center p-3 justify-between border-b-2">
                        <div>{user.name}</div>
                        <div>
                            <Image src={`/assets/images/reset${valueColor}.png`} className='img-fluid' alt='image services' height={25} width={25} />
                        </div>
                    </Link>

                    <div className="border-b-2 p-3 flex justify-between items-center">
                        <div>Historique des réservations</div>
                        <div onClick={() => setShowHistoryBooking(!showHistoryBooking)}>{showHistoryBooking ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
                    </div>

                </div>
            ))}


            <div style={{ height:400 }} />

        </div>
    )
}

export default ClientSingle
