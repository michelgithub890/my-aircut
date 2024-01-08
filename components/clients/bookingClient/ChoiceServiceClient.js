'use client'
import React, { useEffect, useState } from 'react'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// IMAGES 
import { IoIosArrowDown } from "react-icons/io"
import { IoIosArrowUp } from "react-icons/io"

const ChoiceServiceClient = ({ _handleChoiceService, services, lists }) => {
    const [showList, setShowList] = useState("")

    return (
        <div>

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

                            {services.filter(service => service.idList === list.id).map(service => (
                                <div key={service.id} className="border-t-2 p-3" onClick={() => _handleChoiceService(service)} style={{ cursor:"pointer" }}>
                                    <div>{service.name}</div>
                                    <div className="text-sm text-slate-700">{service.duration}min - {service.price}€</div>
                                </div>
                            ))}
                            
                        </>
                    }
    
                </div>
            ))}


        </div>
    )
}

export default ChoiceServiceClient
