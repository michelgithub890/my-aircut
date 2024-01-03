'use client'
import React, { useEffect, useState } from 'react'
// NEXT 
import Image from 'next/image'
import Link from 'next/link' 
import { useRouter } from 'next/navigation'
// IMAGES
// import imageServices from '@/public/assets/images/service.png' 
import imageAddList from '@/public/assets/images/addList.png'
import imageAddServices from '@/public/assets/images/addServices.png'
import imageUpdateList from '@/public/assets/images/updateList.png'
import { IoIosArrowDown } from "react-icons/io"
import { IoIosArrowUp } from "react-icons/io"
// COMPONENTS 
import HeaderPro from '@/components/pro/HeaderPro'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const ServicesPro = () => {
    const { _readLists, lists, _readServices, services } = useFirebase()
    const [showList, setShowList] = useState("")
    const router = useRouter()

    useEffect(() => {
        _readLists()
        _readServices()
    },[])

    const _handleAddService = (id, name) => {
        localStorage.setItem('idList', id)
        localStorage.setItem('nameList', name)
        router.push('/pro/servicesPro/addService')
    }

    // UPDATE LIST 
    const _handleUpdateList = (list) => {
        localStorage.setItem('list', JSON.stringify(list))
        router.push('/pro/servicesPro/updateList')
    }

    // UPDATE SERVICE 
    const _handleUpdateService = (service) => {
        localStorage.setItem('service', JSON.stringify(service))
        router.push('/pro/servicesPro/updateService')   
    }

    return (
        <div>

            <HeaderPro title="Services" />

            <Link href={"/pro/servicesPro/addList"} className="flex justify-center mt-4">
                <Image 
                    src={imageAddList} 
                    className='img-fluid shadow-lg' 
                    priority={true} 
                    alt='image calendar' 
                    style={{ height:50, width:50 }} 
                />
            </Link>

            {lists?.sort((a,b) => a.name.localeCompare(b.name)).map(list => (
                <div key={list.id} className="shadow-lg mt-1">
                    <div 
                        className="flex justify-between p-3 items-center"
                        onClick={() => setShowList(showList === list.id ? '' : list.id)}
                    >
                        <div>{list.name}</div> 

                        {showList === list.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
 
         
                    {showList === list.id && 
                        <>
                            <div className="p-3 flex justify-around border-t-2 items-center">
                                <div className="p-2" onClick={() => _handleAddService(list.id, list.name)} style={{ cursor:"pointer" }}>
                                    <Image src={imageAddServices} className='img-fluid' alt='add service' style={{ height:30, width:30 }} />
                                </div>
                                <div href={"/pro/clients/updateList"} className="p-2" onClick={() => _handleUpdateList(list)}>
                                    <Image src={imageUpdateList} className='img-fluid' alt='update list' style={{ height:30, width:30 }} />
                                </div>
                            </div>

                            {services.filter(service => service.idList === list.id).map(service => (
                                <div key={service.id} className="border-t-2 p-3" onClick={() => _handleUpdateService(service)} style={{ cursor:"pointer" }}>
                                    <div>{service.name}</div>
                                    <div className="text-sm text-slate-700">{service.duration}min - {service.price}€</div>
                                </div>
                            ))}
                            
                        </>
                    }
           

                </div>
            ))}

            <div style={{ height:400 }} /> 

        </div>
    )
}

export default ServicesPro 
