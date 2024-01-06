'use client'
import React, { useState, useEffect } from 'react'
// NEXT 
import { useRouter } from 'next/navigation' 
import Image from 'next/image'
import Link from 'next/link'
// IMAGES 
import { IoMdLogOut } from "react-icons/io"
import imageCalendar from '@/public/assets/images/calendargif.gif'
import imageServices from '@/public/assets/images/service.png'
import imageChat from '@/public/assets/images/chat.png' 
import imageChatGif from '@/public/assets/images/chatgif.gif'
import imagePush from '@/public/assets/images/imagepush.png'
import imageSiteWeb from '@/public/assets/images/homeqrcode.png' 
import imageClients from '@/public/assets/images/clients.png' 
import imageForfait from '@/public/assets/images/forfait.png' 
import imageParametre from '@/public/assets/images/parametre.png'
import imageStaff from '@/public/assets/images/staff.png'
import imageProfil from '@/public/assets/images/imageprofil.png'
import imageOutils from '@/public/assets/images/logo_outils.png'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const HomePro = () => {
    const { _readProfil, profil, _readMessagesChat, messagesChat } = useFirebase()
    const [isAuth, setIsAuth] = useState()
    const [proId, setProId] = useState()
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const auth = localStorage.getItem('isAuth')
            const authData = auth ? JSON.parse(auth) : []
            setIsAuth(authData)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        _readProfil(proId)
        _readMessagesChat(proId)
    },[proId])

    const _handleLogOut = () => {
        localStorage.removeItem('isAuth')
        router.replace("/")
    }

    return (
        <div>

            {profil?.filter(pro => pro.email === isAuth?.email).map(pro => (
                <div className="flex justify-end items-center gap-3 border-b-2 p-3" key={pro.id}>
                    <div>{pro.company}</div>
                    <IoMdLogOut size={"2.2rem"} onClick={_handleLogOut} />
                </div>
            ))}
  
            <div className="mt-3" />

            {/* CARD CALENDAR */}
            <Link href={"/pro/bookingPro"}>
                <div className='flex justify-center' >
                    <div className='w-full mx-2 p-2 rounded-lg shadow-xl'>
                        <div className='flex justify-center'>
                            <Image src={imageCalendar} priority={true} className='img-fluid' alt='image calendar' style={{ height:50, width:50 }} />
                        </div>
                        <div className='text-center' style={{fontSize:12}}>PLANNING</div>
                    </div> 
                </div>
            </Link>

            <div className="flex justify-around mt-4"> 
                <Link href={"/pro/clientsPro"} className="w-2/4 ms-2 p-2 rounded-lg  shadow-xl">
                    <div className="flex justify-center">
                        <Image src={imageClients} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>CLIENTS</div>
                </Link>
                <Link href={"/pro/pushPro"} className="w-2/4 me-2 p-2 rounded-lg shadow-xl">
                    <div className="flex justify-center">
                        <Image src={imagePush} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>NOTIFICATIONS</div>
                </Link>
            </div>  

            <div className="flex justify-around mt-4">  
                <Link href={"/pro/servicesPro"} className="w-2/4 ms-2 p-2 rounded-lg  shadow-xl">
                    <div className="flex justify-center">
                        <Image src={imageServices} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>SERVICES</div> 
                </Link>
                <Link href={"/pro/chatPro"} className="w-2/4 me-2 p-2 rounded-lg  shadow-xl"> 
                    <div className="flex justify-center">
                    {messagesChat.filter(message => message.destinataire === "pro" && !message.read).map(message => message).length > 0 ? 
                            <Image src={imageChatGif} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                        : 
                            <Image src={imageChat} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                        }
                    </div>
                    <div className='text-center' style={{fontSize:12}}>CHAT</div>
                </Link> 
            </div>

            <div className="flex justify-around mt-4">
                <Link href={"/pro/paramPro"} className="w-2/4 ms-2 p-2 rounded-lg shadow-xl">
                    <div className="flex justify-center">
                        <Image src={imageParametre} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>PARAMÈTRES</div>
                </Link>
                {/* QR CODE */}
                <Link href={"/pro/siteWeb"} className="w-2/4 me-2 p-2 rounded-lg shadow-xl">
                    <div className="flex justify-center">
                        <Image src={imageSiteWeb} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>QR CODE</div> 
                </Link>
            </div>

            <div className="flex justify-around mt-4">
                <Link href={"/pro/forfaitPro"} className="w-2/4 ms-2 p-2 rounded-lg shadow-xl">
                    <div className="flex justify-center">
                        <Image src={imageForfait} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>ABONNEMENT</div>
                </Link>
                <Link href={"/pro/staffPro"} className="w-2/4 me-2 p-2 rounded-lg shadow-xl">
                    <div className="flex justify-center"> 
                        <Image src={imageStaff} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>EQUIPE</div>
                </Link>
            </div> 

            <div className="flex justify-around mt-4">
                <Link href={"/pro/profilPro"} className="w-2/4 ms-2 p-2 rounded-lg shadow-xl">
                    <div className="flex justify-center"> 
                        <Image src={imageProfil} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>PROFIL</div>
                </Link>
                <Link href={"/pro/aidesPro"} className="w-2/4 me-2 p-2 rounded-lg shadow-xl">
                    <div className="flex justify-center"> 
                        <Image src={imageOutils} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                    </div>
                    <div className='text-center' style={{fontSize:12}}>AIDES</div>
                </Link>
            </div>
    

            <div style={{ height:400 }} />
            
        </div>
    )
}

export default HomePro



