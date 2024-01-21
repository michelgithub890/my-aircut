import React from 'react'
// DATE FNS 
import { format, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'

const usePlanningPro = () => {

    const _displayDays = (staffs, books, profil, daysOff, hours) => {

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayInt = today.getTime()

        let arrayStaff = []
        const staffMap = staffs?.map(staff => arrayStaff.push(staff))
 
        let arrayBook = []
        const booksMap = books?.map(book => arrayBook.push(book))

        let arrayHours = []
        const hoursMap = hours?.map(hours => arrayHours.push(hours))

        let arrayDayOff = []
        const daysOffMap = daysOff?.filter(dayOff => dayOff.endInt >= todayInt).map(dayOff => arrayDayOff.push(dayOff))

        const start = profil?.map(profil => profil.hoursStartPlanning)
        const end = profil?.map(profil => profil.hoursEndPlanning)
        const numberWeek = profil?.map(profil => profil.numberWeek)

        let arrayDays = []
        const days = _arrayDays(numberWeek).map(day => {
            arrayStaff.map(staff => {
                arrayDays.push({
                    day:_displayDate(day), 
                    staffSurname:staff.surname, 
                    hours:_planningDay(start, end, _displayDate(day), staff, arrayBook, arrayDayOff, arrayHours)
                })
            })
            
        })

        // _hoursDay(_convertTimeToHours(start[0]), _convertTimeToHours(end[0]))

        return arrayDays
    }

    const _arrayDays = (numberWeek) => {
        let array = []
        let numberDays = numberWeek * 7
        for (let i = 0; i <= numberDays; i++) {
            array.push(i)
        }
        return array
    }

    const _displayDate = (day) => {
        const today = new Date()
        const tomorrow = addDays(today, day) // Ajoute un jour à la date actuelle
        const formattedDate = format(tomorrow, 'eeee dd MMMM', { locale: fr })
        const todayInt = new Date()
        todayInt.setHours(0, 0, 0, 0)
        const tomorrowInt = addDays(new Date(todayInt), day)
        tomorrowInt.setHours(0, 0, 0, 0)
        const dateInt = tomorrowInt.getTime()
     
        return ({day:formattedDate,dayInt:dateInt})
    }

    const _convertTimeToHours = (time) => {
        if (typeof time === 'string') {
            const [hours, minutes] = time.split(':').map(Number)
            return hours  
        }
    }

    const _convertTimeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }
    
    const _hoursDay = (start, end) => {
        let array = []
        for (let i = start; i < end; i++) {
            array.push({hour: i < 10 ? `0${i}:00` : `${i}:00`, hourInt:i})  
        }
        return array
    }

    const _quarterHour = (hour) => {
        const hourMinutes = hour * 60
        const hourEnd = hour * 60 + 60 
        let array = []
        for (let i = hourMinutes; i < hourEnd; i+=15) {
            array.push(i)
        }
        return array
    }

    const _planningDay = (start, end, date, staff, books, daysOff, hours) => {
        let array = []

        // demander si le staff travail ce jour 
        const dayString = _dayString(date.dayInt)
        const isAvailable = _isDayOff(staff, daysOff, date.dayInt)
        if (staff[dayString] && isAvailable) {

            // console.log('usePlanningPro le staff travail le ', dayString)
            _hoursDay(_convertTimeToHours(start[0]), _convertTimeToHours(end[0])).map(hour => {

                    _quarterHour(hour.hourInt).map((quart, index) => {

                        const isHours = hours
                        .filter(hourStaff => hourStaff.emetteur === staff.id)
                        .filter(hourStaff => hourStaff.day === dayString)
                        // console hours staff et quart 
                        .filter(hourStaff => quart >= _convertTimeToMinutes(hourStaff.start))
                        .filter(hourStaff => quart < _convertTimeToMinutes(hourStaff.end))

                        if (isHours.length > 0) {

                            let arrayQuart = []
                            const isBooking = books 
                                .filter(book => book.staffId === staff.id)
                                .filter(book => book.date === date.dayInt)
                                .map(book => {

                                    // start end inside hours 
                                    if (
                                        book.time === quart && 
                                        book.time + book.duration === quart + 15 
                                    ) {arrayQuart.push({ hour:hour, book:book })}

                                    // start 
                                    else if (
                                        book.time === quart &&
                                        book.time + book.duration > quart + 15
                                    ) {arrayQuart.push({ hour:hour, book:book })}

                                    // middle 
                                    else if (
                                        book.time < quart &&
                                        book.time + book.duration > quart + 15
                                    ) {arrayQuart.push({ hour:hour, book:book })}

                                    // end
                                    else if (
                                        book.time < quart &&
                                        book.time + book.duration === quart + 15
                                    ) {arrayQuart.push({ hour:hour, book:book })}

                                    // console.log(`usePlanningPro ${book.time} - ${quart}`)
                            })

                            if (arrayQuart.length === 0) {
                                arrayQuart.push({service:"available"})
                            }

                            if (isBooking.length === 0) {
                                arrayQuart.push({service:"available"})
                                array.push({hour:index === 0 && hour, arrayQuart:arrayQuart})
                            } else {
                                array.push({hour:index === 0 && hour, arrayQuart:arrayQuart})
                            }

                        } else {
                            array.push({hour:{hour:index === 0 ? hour.hour : "quartHour"}, available:"hoursOff"})
                        }
                    })
            })

        } else {
            array.push({dayOff:true})
        }

        return array
    }

    const _isDayOff = (staff, daysOff, date) => {
        let isAvailable = true
        daysOff
            .filter(dayOff => dayOff.emetteur === staff.id)
            .filter(dayOff => dayOff.endInt >= date && dayOff.startInt <= date)
            .map(dayOff => isAvailable = false)
        return isAvailable
    }

    const _dayString = (date) => {
        const dayString = format(new Date(date), 'EEEE', { locale: fr })
        return dayString
    }

    return {
        _displayDays,
    }
}

export default usePlanningPro

