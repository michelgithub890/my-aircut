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

        _hoursDay(_convertTimeToHours(start[0]), _convertTimeToHours(end[0]))

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
    
    const _hoursDay = (start, end) => {
        let array = []
        for (let i = start; i < end; i++) {
            array.push(i < 10 ? `0${i}:00` : `${i}:00`)  
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

                const isHours = hours
                    .filter(hourStaff => hourStaff.emetteur === staff.id)
                    .filter(hourStaff => hourStaff.day === dayString)
                    .filter(hourStaff => _convertTimeToHours(hour) >= _convertTimeToHours(hourStaff.start))
                    .filter(hourStaff => _convertTimeToHours(hour) < _convertTimeToHours(hourStaff.end)).length

                if (isHours > 0) {

                    const isBooking = books 
                        .filter(book => book.staffId === staff.id)
                        .filter(book => book.date === date.dayInt)
                        .map(book => {

                            // start end inside hours 
                            if (
                                book.time >= _convertTimeToHours(hour)*60 && 
                                book.time < _convertTimeToHours(hour)*60 + 60 && 
                                book.time + book.duration1 <= _convertTimeToHours(hour)*60 + 60
                            ) {array.push({
                                    hour:hour, 
                                    available:`booking start end 
                                    ${book.staffSurname} 
                                    ${book.timeSTring} 
                                    ${book.duration1}
                                `})}

                            // middle 
                            if (
                                book.time < _convertTimeToHours(hour)*60 && 
                                book.time + book.duration1 > _convertTimeToHours(hour)*60 + 60
                            ) {array.push({
                                hour:hour, 
                                available:`booking middle 
                                ${book.staffSurname}
                                ${book.timeSTring} 
                                ${book.duration1}
                            `})}

                            // start 
                            if (
                                book.time >= _convertTimeToHours(hour)*60 && 
                                book.time < _convertTimeToHours(hour)*60 + 60 && 
                                book.time + book.duration1 > _convertTimeToHours(hour)*60 + 60
                            ) {array.push({
                                hour:hour, 
                                available:`booking start 
                                ${book.staffSurname} 
                                ${book.timeSTring} 
                                ${book.duration1}
                            `})}

                            // end 
                            if (
                                book.time < _convertTimeToHours(hour)*60 && 
                                book.time + book.duration1 > _convertTimeToHours(hour)*60 &&
                                book.time + book.duration1 <= _convertTimeToHours(hour)*60 + 60
                            ) {array.push({
                                hour:hour, 
                                available:`booking end 
                                ${book.staffSurname}  
                                ${book.timeSTring} 
                                ${book.duration1}
                            `})}

                            // end 
                            if (
                                book.time + book.duration1 < _convertTimeToHours(hour)*60 + 60 ||
                                book.time > _convertTimeToHours(hour)*60 + 60
                            ) {array.push({
                                hour:hour, 
                                available:`booking available`})}
                    })

                    if (isBooking.length === 0) {
                        array.push({hour:hour, available:"available"})
                    }

                } else {
                    array.push({hour:hour, available:"hoursOff"})
                }

                    // console.log(`usePlanningPro ${_convertTimeToHours(hour)*60} - ${_convertTimeToHours(hour)*60 + 60}`)
            })
        } else {
            array.push({hour:"days Off", available:"daysOff"})
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

