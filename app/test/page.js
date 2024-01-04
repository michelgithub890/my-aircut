'use client'
import React from 'react'

const page = () => {

    const _handleLocalStorage = () => {
        const proId = "aubaudsalon12345678"
        localStorage.setItem('proId', proId)
    }

    const _handleGetStorage = () => {
        const proId = localStorage.getItem('proId')
        console.log("test _handleGetStorage:", proId)
    }

    return (
        <div>
            <div>Page test</div>

            <button className="myButton" onClick={_handleLocalStorage}>Enregistrer</button>

            <button className="myButtonRed" onClick={_handleGetStorage}>Afficher</button>
        </div>
    )
}

export default page
