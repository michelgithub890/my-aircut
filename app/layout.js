'use client'
import React, { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { useSearchParams } from 'next/navigation'


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const searchParams = useSearchParams()
  const [montage, setMontage] = useState(0)
  const [proId, setProId] = useState()

  useEffect(() => {
      setMontage(1)
  },[])

  useEffect(() => {
    if (montage === 1) {
      if (typeof window !== "undefined") {
        const search = searchParams.get('search')
        // if (search) search ? localStorage.setItem('proId', search) : localStorage.setItem('proId', "aubaudsalon12345678")
        if (search) search && localStorage.setItem('proId', search) 
        const mykey = searchParams.get('mykey')
        if (mykey) mykey && localStorage.setItem('mykey', mykey)
        setProId(search)
      setMontage(2)
      }
    }
  },[montage])

    return (
      <html lang="en">
        <body className={inter.className}>
            {/* {proId ? children : null} */}
            {children}
        </body>
      </html>
    )

}
