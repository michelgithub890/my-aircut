import React from 'react'
// MUI 
import { Divider, Typography } from '@mui/material'
// DATE FNS 
import { format, addDays } from 'date-fns'
import { fr } from 'date-fns/locale' 

const Planning = ({ day, staff, profil, books }) => { 

    const _hoursDay = () => {
        const startString = profil.map(profil => profil.hoursStartPlanning)
        const start = parseInt(startString[0].split(':')[0], 10)
        const endString = profil.map(profil => profil.hoursEndPlanning)
        const end = parseInt(endString[0].split(':')[0], 10)
        // console.log("planning", start)
        let array = [];
        for (let i = start; i < end; i++) {
            array.push(i < 10 ? `0${i}:00` : `${i}:00`) // Format the hour to match the design
        }
        return array;
    }

    const _displayDate = () => {
        const today = new Date()
        const tomorrow = addDays(today, day) // Ajoute un jour à la date actuelle
        const formattedDate = format(tomorrow, 'eeee dd MMMM', { locale: fr })
        return formattedDate
    }

    const _displayServices = () => {
        const arrayBooks = []
        const booksMap = books.filter(book => book.staffId === staff.id).map(book => arrayBooks.push(book))

    }

    return (
        <div>
            <div className="p-2 text-center">{_displayDate()}</div>
            <div className="text-center">{staff.surname}</div>
            {_hoursDay().map((hour, index) => (
                <div key={index}>
                    <div className="flex items-center justify-start px-4 py-4 gap-4">
                        <Typography variant="subtitle1">{hour}</Typography>
                        {books?.filter(book => book.staffId === staff.id).map(book => (
                            <>
                                <div className="bg-blue-300 p-2 rounded-lg">{book.service1}</div>
                            </>
                        ))}
                    </div>
                    {index !== _hoursDay().length - 1 && <Divider light />}
                </div>
            ))}
        </div>
    )
}

export default Planning
