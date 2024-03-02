'use client'
import React, { useEffect, useState } from 'react'
// NEXT 
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link' 
// MUI 
import { Radio, FormControl, RadioGroup, FormControlLabel, FormLabel } from '@mui/material'
// IMAGES 
import imageProfilOff from '@/public/assets/images/profiloff.png'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
import ModalConfirm from '@/components/modals/ModalConfirm'

const HomeClients = () => {
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState("")
    const { _readProfil, profil, _readUsers, users, _readMessagesChat, messagesChat, _readBooks, books, _deleteData } = useFirebase()
    const [showModalRemove, setShowModalRemove] = useState(false)
    const router = useRouter()
    const [valueColor, setValueColor] = useState('')

    useEffect(() => {
        if (typeof window !== "undefined") {
            const auth = localStorage.getItem("isAuth")
            const authData = auth ? JSON.parse(auth) : []
            setIsAuth(authData)
            const storedPro = localStorage.getItem("proId")
            if (storedPro) setProId(storedPro) 
            const themeStored = localStorage.getItem("theme")
            if (themeStored) setValueColor(themeStored)
        }
    console.log('home_client') 
    },[])

    useEffect(() => { 
        if (proId) {
            _readUsers(proId)
            _readProfil(proId) 
            _readMessagesChat(proId)
            _readBooks(proId)
        } 
    },[proId])

    useEffect(() => {
        if (profil) {
            const colorChoice = localStorage.getItem("themeColor")
            profil.filter(pro => pro.proId === proId).map(pro => {
                pro.themeColor !== colorChoice && 
                localStorage.setItem("themeColor", pro.themeColor)
                setValueColor(pro.themeColor)
            })
        }
    },[profil])

    useEffect(() => {
        if (isAuth?.status === 'pro') router.push('/pro/homePro')
    },[isAuth])

    useEffect(() => {
        if (isAuth?.status === 'staff' && isAuth[proId]) router.push('/staff/homeStaff')
    },[isAuth])

    const _handleMap = () => {
        profil?.filter(pro => pro.proId == proId).map(pro => {
            window.open(pro.map, "_blank") 
        })
    }

    const _handlePhone = () => {
        profil?.filter(pro => pro.proId == proId).map(pro => {
            const phoneUrl = `tel:${pro.phone}`
            try {
                window.location.href = phoneUrl
            } catch {
                console.log('impossible')
            }  
        })
    }

    const _handleRemoveBook = (id) => {
        _deleteData(`pro/${proId}/books/${id}`)
        setShowModalRemove(false)
    }

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    return (
        <div>

            {profil?.filter(pro => pro.proId === proId).map(pro => (
                <div key={pro.id}>

                    <div className="flex justify-end items-center gap-3 border-b-2 p-3">
                        {isAuth?.[proId] ? 
                            <>
                                {users?.filter(user => user.email === isAuth?.email).map(user => (
                                    <div key={user.id} className="flex items-center gap-3">
                                        <div>{user.name}</div>
                                        <Link href={"/clients/profilClients"}>
                                            <Image src={`/assets/images/profilon${valueColor}.png`} className='img-fluid' alt='image calendar' height={38} width={38} />
                                        </Link>
                                    </div>
                                ))} 
                            </>
                        :
                            <>
                                <div>Se connecter</div>
                                <Link href={"/auth/signin"}>
                                    <Image src={imageProfilOff} className='img-fluid' alt='image calendar' height={38} width={38} />
                                </Link>
                            </>
                        }
                    </div>

                    {isAuth?.[proId] && books?.filter(book => book.authId === isAuth?.id).map(book => (
                        <div className={`my-book${valueColor}`} key={book.id}>
                            <div onClick={() => setShowModalRemove(true)} style={{ cursor:"pointer" }}>
                                <div>{book.dateString} à {book.timeString}</div>
                                <div>coupe: {book.service}</div>
                                <div>{book.duration}min - {book.price}€</div>
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

                    <div className="text-center mt-4 text-xl">{pro.company}</div>

                    <div className="flex justify-center">
                        <Image src={`/assets/icons/${pro.icon}.png`} priority={true} className='img-fluid' alt='image calendar' width={150} height={150} />
                    </div>

                    {/* CARD CALENDAR */}
                    <Link href={"/clients/bookingClients"}>
                        <div className='flex justify-center' /*  onClick={() => navigate('/bookingUsersPage')} */  >
                            <div className={`w-full mx-2 p-2 rounded-lg shadow-xl`}>
                                <div className='flex justify-center'>
                                    <Image src={`/assets/images/planning${valueColor}.gif`} className='img-fluid' alt='image calendar' width={80} height={80} />
                                </div>
                                <div className='text-center' style={{fontSize:12}}>PRENDRE RDV</div>
                            </div> 
                        </div>
                    </Link> 

                    <div className="flex justify-around mt-4">
                        {/* <Link href={"/clients/openingHours"}> */}
                            <Link href={"/clients/openingHours"} className={`w-2/4 ms-2 me-1 p-2 rounded-lg shadow-xl`}>
                                <div className="flex justify-center">
                                    <Image 
                                        src={`/assets/images/hours${valueColor}.png`} 
                                        className='img-fluid' 
                                        alt='image services' 
                                        style={{ height:50, width:50 }} 
                                        width={50} 
                                        height={50} 
                                    />
                                </div>
                                <div className='text-center' style={{fontSize:12}}>HORAIRES</div>
                            </Link>
                        {/* </Link> */}
                        <Link href={"/clients/bookingClients"} className={`w-2/4 me-2 ms-1 p-2 rounded-lg shadow-xl`}>
                            <div className="flex justify-center">
                                <Image src={`/assets/images/services${valueColor}.png`} className='img-fluid' alt='image services' height={50} width={50} />
                            </div>
                            <div className='text-center' style={{fontSize:12}}>SERVICES</div>
                        </Link>
                    </div>

                    <div className="flex justify-around mt-4">
                        <div className={`w-2/4 ms-2 me-1 p-2 rounded-lg shadow-xl`} onClick={_handleMap}>
                            <div className="flex justify-center">
                                <Image src={`/assets/images/map${valueColor}.png`} className='img-fluid' alt='image services' height={50} width={50} />
                            </div>
                            <div className='text-center' style={{fontSize:12}}>NOUS SITUER</div>
                        </div>
                        <Link href={isAuth?.[proId] ? "/clients/chatClients" : "/clients/chatClients/chatClientsAuth" } className={`w-2/4 ms-1 me-2 p-2 rounded-lg shadow-xl`}>
                            <div className="flex justify-center">
                                {messagesChat
                                    ?.filter(message => message.userEmail === isAuth?.email && message.destinataire === "client" && !message.read)
                                    .map(message => message.id).length > 0 ? 
                                    <Image src={`/assets/images/chatgif${valueColor}.gif`} className='img-fluid' alt='image services' height={50} width={50} />
                                : 
                                    <Image src={`/assets/images/chat${valueColor}.png`} className='img-fluid' alt='image services' height={50} width={50} /> 
                                }
                            </div>
                            <div className='text-center' style={{fontSize:12}}>CHAT</div>
                        </Link>
                    </div>

                    <div className="flex justify-around mt-4">
                        <Link href={isAuth?.[proId] ? "/clients/profilClients" : "/auth/signin"} className={`w-2/4 ms-2 me-1 p-2 rounded-lg shadow-xl`}>
                            <div className="flex justify-center">
                                <Image src={`/assets/images/profil${valueColor}.png`} className='img-fluid' alt='image services' height={50} width={50} />
                            </div>
                            <div className='text-center' style={{fontSize:12}}>MON PROFIL</div>
                        </Link>
                        <div className={`w-2/4 me-2 ms-1 p-2 rounded-lg shadow-xl`} onClick={_handlePhone}>
                            <div className="flex justify-center">
                                <Image src={`/assets/images/phone${valueColor}.png`} className='img-fluid' alt='image services'  height={50} width={50} />
                            </div>
                            <div className='text-center' style={{fontSize:12}}>APPELER</div>
                        </div>
                    </div>

                </div>
            ))}

        {/* <FormControl className="mt-10">
            <FormLabel id="demo-controlled-radio-buttons-group">Couleurs</FormLabel>
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
            >
                <div className="ms-4">
                    <FormControlLabel value="" control={<Radio />} label="bluelight" />
                    <FormControlLabel value="brown" control={<Radio />} label="brown" />
                    <FormControlLabel value="orange" control={<Radio />} label="orange" />
                </div>
                <div className="ms-4">
                    <FormControlLabel value="pink" control={<Radio />} label="pink" />
                    <FormControlLabel value="blue" control={<Radio />} label="blue" />
                    <FormControlLabel value="green" control={<Radio />} label="green" />
                    <FormControlLabel value="purple" control={<Radio />} label="purple" />
                </div>
            </RadioGroup>
        </FormControl> */}

        <div />

            <div style={{ height:400 }} />

        </div>
    )
}

export default HomeClients





