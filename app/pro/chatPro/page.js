'use client'
import React, { useEffect, useState } from 'react'
// NEXT  
import { useRouter } from 'next/navigation' 
// FIREBASE  
import useFirebase from '@/firebase/useFirebase'
// COMPONENTS  
import HeaderPro from '@/components/pro/HeaderPro'

const ChatPro = () => {
    const { _readMessagesChat, messagesChat, _readUsers, users } = useFirebase() 
    const router = useRouter()
    const [proId, setProId] = useState()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])
    
    useEffect(() => {
        if (proId) {
            _readMessagesChat(proId)
            _readUsers(proId)
        }
    },[proId])

    const _handleNav = (emetteur) => {
        localStorage.setItem('emetteur', JSON.stringify(emetteur))
        localStorage.setItem('url', "/pro/chatPro")
        router.push("/pro/chatPro/chatSingle")
    }

    return ( 
        <div> 

            <HeaderPro title="Chat" /> 

            {users
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map(user => (
                    messagesChat
                        ?.filter(message => message.destinataire === "pro")
                        .filter(message => message.userId === user.id)
                        .filter(message => !message.read)
                        .reverse()
                        .map((message, indexMessage) => (
                            indexMessage < 1 &&
                            <div 
                                key={message.id}
                                className='bg-white border border-b-gray-300 p-2 cursor-pointer' 
                                onClick={() => _handleNav(message)}
                            >
                                <div>{user.name}</div>
                                <div className="text-slate-600 text-sm">{message.message}</div>
                                <div className="text-green-500 italic text-sm">new</div>
                            </div>
                        ))
            ))}

            {users
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map(user => (

                    messagesChat
                    ?.filter(message => message.destinataire === "pro")
                    .filter(message => message.userId === user.id)
                    .filter(message => !message.read).length === 0 && 

                    messagesChat
                        ?.filter(message => message.destinataire === "pro")
                        .filter(message => message.userId === user.id)
                        .reverse()
                        .map((message, indexMessage) => (
                            indexMessage < 1 &&
                            <div 
                                key={message.id}
                                className='bg-white border border-b-gray-300 p-2 cursor-pointer' 
                                onClick={() => _handleNav(message)}
                            >
                                <div>{user.name}</div>
                                <div className="text-slate-600 text-sm">{message.message}</div>
                            </div>
                        ))
            ))}

            <div style={{ height:"400px" }} />

        </div> 
    )
}

export default ChatPro
 