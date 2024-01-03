import React from 'react'
// NEXT 
import Link from 'next/link'  
// IMAGES 
import { IoIosArrowRoundBack } from "react-icons/io"

const HeaderClients = ({ title }) => {
    return (
        <div className="flex justify-start items-center gap-3 shadow-lg p-3">
            <Link href={"/clients/homeClients"}>
                <IoIosArrowRoundBack size={"2.2rem"} />
            </Link> 
            <div>{title}</div>
        </div>
    )
}

export default HeaderClients
