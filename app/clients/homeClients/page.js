'use client'
import React, { useEffect, useState } from 'react'
// NEXT 
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link' 
// IMAGES 
import imageCalendar from '@/public/assets/images/calendargif.gif'
import imageHoraires from '@/public/assets/images/horaires.png'
import imageHours from '@/public/assets/images/hours.png'
import imageServices from '@/public/assets/images/service.png'
import imageMap from '@/public/assets/images/map.png'
import imagePhone from '@/public/assets/images/phone.png'
import imageChat from '@/public/assets/images/chat.png' 
import imageChatGif from '@/public/assets/images/chatgif.gif'
import imageProfil from '@/public/assets/images/imageprofil.png'
import imageProfilOn from '@/public/assets/images/profilon.png'
import imageProfilOff from '@/public/assets/images/profiloff.png'
import imagePlanning from '@/public/assets/images/planninggif.gif'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
import ModalConfirm from '@/components/modals/ModalConfirm'

const HomeClients = () => {
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState("")
    const { _readProfil, profil, _readUsers, users, _readMessagesChat, messagesChat, _readBooks, books, _deleteData } = useFirebase()
    const [customIcon, setCustomIcon] = useState()
    const [showModalRemove, setShowModalRemove] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const auth = localStorage.getItem("isAuth")
            const authData = auth ? JSON.parse(auth) : []
            setIsAuth(authData)
            const storedPro = localStorage.getItem("proId")
            if (storedPro) setProId(storedPro) 
        }
    },[])

    useEffect(() => { 
        if (proId) {
            _readUsers(proId)
            _readProfil(proId) 
            _readMessagesChat(proId)
            _readBooks(proId)
            setCustomIcon(`../../../public/assets/images/profiloff.png`)
        }
    },[proId])

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
                                            <Image src={imageProfilOn} className='img-fluid' alt='image calendar' style={{ height:'2.2rem', width:'2.2rem' }} />
                                        </Link>
                                    </div>
                                ))} 
                            </>
                        :
                            <>
                                <div>Se connecter</div>
                                <Link href={"/auth/signin"}>
                                    <Image src={imageProfilOff} className='img-fluid' alt='image calendar' style={{ height:'2.2rem', width:'2.2rem' }} />
                                </Link>
                            </>
                        }
                    </div>

                    {isAuth?.[proId] && books?.filter(book => book.authId === isAuth?.id).map(book => (
                        <div className="myBook" key={book.id}>
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
                            <div className='w-full mx-2 p-2 rounded-lg shadow-xl'>
                                <div className='flex justify-center'>
                                    <Image src={imagePlanning} className='img-fluid' alt='image calendar' style={{ height:50, width:50 }} />
                                </div>
                                <div className='text-center' style={{fontSize:12}}>PRENDRE RDV</div>
                            </div> 
                        </div>
                    </Link>

                    <div className="flex justify-around mt-4">
                        {/* <Link href={"/clients/openingHours"}> */}
                            <Link href={"/clients/openingHours"} className="w-2/4 ms-2 p-2 rounded-lg shadow-xl">
                                <div className="flex justify-center">
                                    <Image src={imageHours} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                                </div>
                                <div className='text-center' style={{fontSize:12}}>HORAIRES</div>
                            </Link>
                        {/* </Link> */}
                        <Link href={"/clients/bookingClients"} className="w-2/4 me-2 p-2 rounded-lg  shadow-xl">
                            <div className="flex justify-center">
                                <Image src={imageServices} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                            </div>
                            <div className='text-center' style={{fontSize:12}}>SERVICES</div>
                        </Link>
                    </div>

                    <div className="flex justify-around mt-4">
                        <div className="w-2/4 ms-2 p-2 rounded-lg shadow-xl" onClick={_handleMap}>
                            <div className="flex justify-center">
                                <Image src={imageMap} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                            </div>
                            <div className='text-center' style={{fontSize:12}}>NOUS SITUER</div>
                        </div>
                        <Link href={isAuth?.[proId] ? "/clients/chatClients" : "/clients/chatClients/chatClientsAuth" } className="w-2/4 me-2 p-2 rounded-lg  shadow-xl">
                            <div className="flex justify-center">
                                {messagesChat
                                    ?.filter(message => message.userEmail === isAuth?.email && message.destinataire === "client" && !message.read)
                                    .map(message => message.id).length > 0 ? 
                                    <Image src={imageChatGif} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                                : 
                                    <Image src={imageChat} className='img-fluid' alt='image services' style={{ height:50, width:50 }} /> 
                                }
                            </div>
                            <div className='text-center' style={{fontSize:12}}>CHAT</div>
                        </Link>
                    </div>

                    <div className="flex justify-around mt-4">
                        <Link href={isAuth?.[proId] ? "/clients/profilClients" : "/auth/signin"} className="w-2/4 ms-2 p-2 rounded-lg  shadow-xl">
                            <div className="flex justify-center">
                                <Image src={imageProfil} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                            </div>
                            <div className='text-center' style={{fontSize:12}}>MON PROFIL</div>
                        </Link>
                        <div className="w-2/4 me-2 p-2 rounded-lg shadow-xl" onClick={_handlePhone}>
                            <div className="flex justify-center">
                                <Image src={imagePhone} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                            </div>
                            <div className='text-center' style={{fontSize:12}}>APPELER</div>
                        </div>
                    </div>

                </div>
            ))}

            <div style={{ height:400 }} />

        </div>
    )
}

export default HomeClients





