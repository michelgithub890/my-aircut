import HeaderClients from '@/components/clients/HeaderClients'
import React from 'react'
import Link from 'next/link'

const ChatClientsAuth = () => {
    return (
        <div>

            <HeaderClients title="Retour" />

            <div className="text-center text-xl m-10">Vous devez être authentifié pour accéder au chat</div>

            <Link href={"/auth/signin"} className="flex justify-center mt-6">
                <button className="myButtonGrey">{"Me connecter / creer un compte"}</button>
            </Link>

        </div>
    )
}

export default ChatClientsAuth
