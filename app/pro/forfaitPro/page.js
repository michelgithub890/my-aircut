'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderPro from '@/components/pro/HeaderPro'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const ForfaitPro = () => {
    const { _updateData, _readProfil, profil } = useFirebase()
    const [confirm, setConfirm] = useState(false)

    useEffect(() => {
        _readProfil()
    },[])

    const _handleUpdateForfait = () => {
        const id = profil[0].id
        const data = {
            forfait:"demandeDesabonnement"
        }
        _updateData(`profil/${id}`, data)
    }

    return (
        <div>

            <HeaderPro title="Abonnement" />

            {profil?.map(pro => (
                <div key={pro.id} className="mt-10">
                    <>
                        {pro.forfait === "demandeDesabonnement" ?
                            <div>
                                <div className="text-center text-2xl">Votre demande de désabonnement est en cours de traitement.</div>
                            </div>
                        :
                            <div>
                                <div className="text-center text-2xl">Vous êtes abonné</div>
                                <div className='flex justify-center mt-10'>
                                    {confirm ? 
                                        <button className="myButtonRed" onClick={_handleUpdateForfait}>Confirmer</button>
                                    : 
                                        <button className="myButtonRed" onClick={() => setConfirm(true)}>Me desabonner</button>
                                    }
                                </div>
                            </div>
                        }
                    </>
                  
                 
                </div>
            ))}

            <div style={{ height:400 }} />

        </div>
    )
}

export default ForfaitPro
