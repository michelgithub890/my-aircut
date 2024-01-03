'use client'
import React, { useEffect } from 'react'
// NEXT 
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link' 
// IMAGES 
import imageCalendar from '@/public/assets/images/calendargif.gif'
import imageHoraires from '@/public/assets/images/horaires.png'
import imageServices from '@/public/assets/images/service.png'
import imageMap from '@/public/assets/images/map.png'
import imagePhone from '@/public/assets/images/phone.png'
import imageChat from '@/public/assets/images/chat.png' 
import imageChatGif from '@/public/assets/images/chatgif.gif'
import imageProfil from '@/public/assets/images/imageprofil.png'
import imageLogo from '@/public/assets/images/logo.png'
import imageProfilOn from '@/public/assets/images/profilon.png'
import imageProfilOff from '@/public/assets/images/profiloff.png'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const HomeClients = () => {
    const { data: session, status } = useSession()
    const { _readProfil, profil, _readUsers, users, _readMessagesChat, messagesChat } = useFirebase()
    const router = useRouter()

    useEffect(() => {
        _readProfil()
        _readUsers()
        _readMessagesChat()
    },[])
    
    if (session?.user.email === 'aubaudsalon@gmail.com') router.push('/pro/homePro')

    const _handleMap = () => {
        window.open(profil[0].map, "_blank")
    }

    const _handlePhone = () => {
        const phoneUrl = `tel:${profil[0].phone}`
        try {
            window.location.href = phoneUrl
        } catch {
            console.log('impossible')
        }  
    }

    return (
        <div>

            {profil?.map(pro => (
                <div key={pro.id}>

                    <div>booking to come</div>

                    <div className="flex justify-end items-center gap-3 shadow-lg p-3">
                        {session?.user.email ? 
                            <>
                                {users?.filter(user => user.email === session?.user.email).map(user => (
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
                                <div>Se connecter {session?.user.email}</div>
                                <Link href={"/auth/signin"}>
                                    <Image src={imageProfilOff} className='img-fluid' alt='image calendar' style={{ height:'2.2rem', width:'2.2rem' }} />
                                </Link>
                            </>
                        }
                    </div>

                    <div className="text-center mt-4 text-xl">{pro.company}</div>

                    <div className="flex justify-center">
                        <Image src={imageLogo} priority={true} className='img-fluid' alt='image calendar' style={{ height:150, width:150 }} />
                    </div>

                    {/* CARD CALENDAR */}
                    <Link href={"/clients/bookingClients"}>
                        <div className='flex justify-center' /*  onClick={() => navigate('/bookingUsersPage')} */  >
                            <div className='w-full mx-2 p-2 rounded-lg shadow-xl'>
                                <div className='flex justify-center'>
                                    <Image src={imageCalendar} className='img-fluid' alt='image calendar' style={{ height:50, width:50 }} />
                                </div>
                                <div className='text-center' style={{fontSize:12}}>PRENDRE RDV</div>
                            </div> 
                        </div>
                    </Link>

                    <div className="flex justify-around mt-4">
                        {/* <Link href={"/clients/openingHours"}> */}
                            <Link href={"/clients/openingHours"} className="w-2/4 ms-2 p-2 rounded-lg shadow-xl">
                                <div className="flex justify-center">
                                    <Image src={imageHoraires} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
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
                        <Link href={status === "unauthenticated" ? "/clients/chatClients/chatClientsAuth" : "/clients/chatClients"} className="w-2/4 me-2 p-2 rounded-lg  shadow-xl">
                            <div className="flex justify-center">
                                {messagesChat
                                    ?.filter(message => message.userEmail === session?.user.email && message.destinataire === "client" && !message.read)
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
                        <Link href={status === "authenticated" ? "/clients/profilClients" : "/auth/signin"} className="w-2/4 ms-2 p-2 rounded-lg  shadow-xl">
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









