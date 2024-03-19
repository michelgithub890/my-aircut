'use client'
import React, { useEffect, useState } from 'react'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// MODELS 
import { MODEL_COLOR } from '@/models/ModelColor'
// IMAGES 
import { IoIosArrowDown } from "react-icons/io"
import { IoIosArrowUp } from "react-icons/io"

const ChoiceServiceClient = ({ _handleChoiceService, services, lists, valueColor }) => {
    const [showList, setShowList] = useState("")

    return (
        <div>

            {lists?.sort((a,b) => a.name.localeCompare(b.name)).map(list => (
                // <div key={list.id} className="shadow-lg mt-1 p-2" style={{ border:`1px solid ${MODEL_COLOR[valueColor]}`}}>
                <div key={list.id} className="mt-3 p-2 mx-2" style={{ border:`1px solid ${MODEL_COLOR[valueColor] ? MODEL_COLOR[valueColor] : MODEL_COLOR.blueApply}`}}>
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
                                <div 
                                    key={service.id} 
                                    className="p-3" 
                                    onClick={() => _handleChoiceService(service)} 
                                    style={{ cursor:"pointer", borderTop:`1px solid ${MODEL_COLOR[valueColor] ? MODEL_COLOR[valueColor] : MODEL_COLOR.blueApply}` }}
                                >
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
