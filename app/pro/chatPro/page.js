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
        _readMessagesChat(proId)
        _readUsers(proId)
    },[proId])

    const _handleNav = (emetteur) => {
        localStorage.setItem('emetteur', JSON.stringify(emetteur))
        localStorage.setItem('url', "/pro/chatPro")
        router.push("/pro/chatPro/chatSingle")
    }

    const _isNewsMessages = (userId) => {
        // create array / creation d'un tableau vide
        let messagesNews = []
        // ask if new messages / chercher si il y a des nouveaux messages en provenance de l'utilisateur 
        messagesChat
            ?.filter(message => message.userId === userId && !message.read && message.destinataire === "pro")
            // push news messages in array / si des nouveaux messages les ajouter dans la tableau
            .map(message => messagesNews.push(message))

            
            // create let false / créer un let avec la valeur false 
            let isNewMessage = false
            // is new message return true / si il y a des nouveaux messages retourner true
            if (messagesNews.length > 0) {isNewMessage = true}

        // return true / false 
        return isNewMessage
    }

    return ( 
        <div> 

            <HeaderPro title="Chat" />

            {users?.sort((a, b) => a.name.localeCompare(b.name)).map(user => (
                <div key={user.id}>
                    {_isNewsMessages(user.id) ? 
                        messagesChat
                            ?.filter(message => message.userId === user.id)
                            .reverse()
                            .map((message,i) => (
                            i < 1 &&
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
                    : 
                        messagesChat
                            ?.filter(message => message.userId === user.id)
                            .reverse()
                            .map((message,i) => (
                            i < 1 &&
                            <div 
                                key={message.id}
                                className='bg-white border border-b-gray-300 p-2 cursor-pointer' 
                                onClick={() => _handleNav(message)}
                            >
                                <div>{user.name}</div>
                                <div className="text-slate-600 text-sm">{message.message}</div>
                            </div>
                        ))
                    }
                </div>
            ))}

            <div style={{ height:"400px" }} />

        </div> 
    )
}

export default ChatPro
 