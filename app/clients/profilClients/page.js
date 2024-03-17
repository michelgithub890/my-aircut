'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderClients from '@/components/clients/HeaderClients'
import ModalConfirm from '@/components/modals/ModalConfirm'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// MUI 
import { Card, CardContent } from '@mui/material'
// NEXT 
import { useRouter } from 'next/navigation'
// ICONS 
import { IoIosArrowDown } from "react-icons/io"
import { IoIosArrowUp } from "react-icons/io"

const ProfilClients = () => {
    const { _readUsers, users, _readBooks, books, _deleteData } = useFirebase()
    const [isAuth, setIsAuth] = useState("")
    const [proId, setProId] = useState("")
    const [showModalRemove, setShowModalRemove] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [todayDate, setTodayDate] = useState()
    const [valueColor, setValueColor] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const auth = localStorage.getItem('isAuth')
            const authData = auth ? JSON.parse(auth) : null
            setIsAuth(authData);
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const todayInt = today.getTime()
            setTodayDate(todayInt)
            const storedProId = localStorage.getItem('proId')
            if (storedProId) setProId(storedProId)
            // THEME COLOR 
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
            _readBooks(proId)
        }
    },[proId])

    const _handleSignOut = () => {
        localStorage.removeItem('isAuth')
        router.push("/clients/homeClients")
    }

    const _handleRemoveBook = (id) => {
        _deleteData(`pro/${proId}/books/${id}`)
        setShowModalRemove(false)
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

            {isAuth?.[proId] && books?.filter(book => book.authId === isAuth?.id).filter(book => book.date >= todayDate).map(book => (
                <div className={`my-book${valueColor}`} key={book.id}>
                    <div onClick={() => setShowModalRemove(true)} style={{ cursor:"pointer" }}>
                        <div>{book.dateString} à {book.timeString}</div>
                        <div>coupe: {book.service}</div> 
                        <div>{book.duration}min {book.price}€</div>
                        <div>avec {book.staffSurname}</div>
                    </div> 
                    <ModalConfirm
                        handleClose={() => setShowModalRemove(false)} 
                        open={showModalRemove} 
                        handleConfirm={() => _handleRemoveBook(book.id)}
                        title={"Êtes vous sûr de vouloir supprimer le rendez-vous ?"}
                    />
                </div>   
            ))}
 
            <div className="mt-3 mx-3">
                <Card>
                    <CardContent>
                        <div className="flex justify-between" onClick={() => setShowHistory(!showHistory)}>
                            <div>Historique des réservations</div>
                            {showHistory ? 
                                <IoIosArrowUp style={{ height:20, width:20 }} /> : <IoIosArrowDown style={{ height:20, width:20 }} />
                            }
                        </div> 
                    </CardContent> 
                </Card>
            </div>

            {showHistory && isAuth?.[proId] && books?.filter(book => book.authId === isAuth?.id).filter(book => book.date < todayDate).map((book, index) => (
                <div className="myBookGrey" key={index}>
                    <div>{book.dateString} à {book.timeString}</div>
                    <div>coupe: {book.service}</div> 
                    <div>{book.duration}min {book.price}€</div>
                    <div>avec {book.staffSurname}</div>
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










