'use client'
import React, { useEffect, useState } from 'react'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// NEXT 
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
// IMAGES 
import imageCaseACocher from '@/public/assets/images/caseACocher.png'
import imageCaseACocherOk from '@/public/assets/images/caseACocherOk.png'

const UpdateStaffServices = () => {
    const { _readServices, services, _readLists, lists, _readStaffs, staffs, _updateData } = useFirebase()
    const [staffId, setStaffId] = useState()
    const [proId, setProId] = useState()

    useEffect(() => {
        if (typeof window !== "undefined") {
            setStaffId(localStorage.getItem('staffId'))
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[])

    useEffect(() => {
        _readServices(proId)
        _readLists(proId)
        _readStaffs(proId)
    },[proId])

    const _handlePutOnService = (serviceId) => {
        const data = {
            [staffId]:true
        }
        _updateData(`pro/${proId}/services/items/${serviceId}`, data)
    }

    const _handlePutOffService = (serviceId) => {
        const data = {
            [staffId]:false
        }
        _updateData(`pro/${proId}/services/items/${serviceId}`, data)
    }

    return (
        <div>

            <Link href={"/pro/staffPro/updateStaff"}>
                <div className="text-end p-3">Fermer</div>
            </Link>

            <div className="text-center mt-3">Services</div>

            {lists?.sort((a, b) => b.name.localeCompare(a.name)).map(list => (
                <div key={list.id} className="mt-3">
                    <div className="bg-slate-300 p-3">{list.name}</div>
                        {services?.sort((a, b) => b.name.localeCompare(a.name)).filter(service => service.idList === list.id).map(service => (
                            <div key={service.id} className="p-3 flex items-center gap-4">
                                <div>
                                    {service[staffId] ? 
                                        <Image 
                                            src={imageCaseACocherOk} 
                                            className='img-fluid' 
                                            alt='image services' 
                                            style={{ height:20, width:20 }} 
                                            onClick={() => _handlePutOffService(service.id)}
                                        />
                                    :
                                        <Image 
                                            src={imageCaseACocher} 
                                            className='img-fluid' 
                                            alt='image services' 
                                            style={{ height:20, width:20 }} 
                                            onClick={() => _handlePutOnService(service.id)}
                                        />
                                    }
                                </div>
                                <div>{service.name}</div>
                            </div>
                        ))}
                </div>
            ))}

            <div style={{ height:400 }} />
        
        </div>
    )
}

export default UpdateStaffServices
