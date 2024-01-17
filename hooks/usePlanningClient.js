// DATE FNS
import { format, addDays, parse, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'

const usePlanningClient = () => {

    const _displayPlanningFinal = (servicesStorage, staffs, services, daysOff, hours, profil, proId, books) => {

        // nombre total de jours (semaines de réservations * 7)
        const numberWeek = profil.filter(profil => profil.proId === proId).map(pro => pro.numberWeek)
        const totalDays = numberWeek[0] * 7

        // faire une copie de chaque array
        const arrayStaff = []
        const arrayService = []
        const arrayDaysOff = []
        const arrayHours = []
        const arrayBooks = []

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayInt = today.getTime()

        const staffMap = staffs.map(staff => arrayStaff.push(staff))
        const serviceMap = services.map(service => arrayService.push(service))
        // filter seulement les jours qui debut ce jour
        const daysOffMap = daysOff.filter(dayOff => dayOff.endInt >= todayInt).map(dayOff => arrayDaysOff.push(dayOff))
        //  .filter(dayOff => dayOff.startInt <= ta)
        const booksMap = books.filter(book => book.date >= todayInt).map(book => arrayBooks.push(book))
        const hoursMaps = hours.map(hour => arrayHours.push(hour))
        const servicesChoice = servicesStorage ? servicesStorage : [] 

        // recuperer les 60 prochains jours  moins les jours de fermetures du salon
        const days60 = _daysInt60(totalDays)
        const days60DaysOff = days60.filter(day60 => {
            return !arrayDaysOff.filter(dayOff => dayOff.emetteur === "pro").some(dayOff => {
                return day60 >= dayOff.startInt && day60 <= dayOff.endInt
            })
        })

        // nombre de services 
        const numberServices = servicesStorage?.map(service => service).length

        const filterService3 =  _filterService3(days60DaysOff, servicesChoice, arrayStaff, arrayDaysOff, arrayHours, arrayBooks)

        const finalService = _finalServices(filterService3, numberServices, servicesChoice)

        return finalService 

    }

    const _filterService3 = (days60DaysOff, servicesChoice, arrayStaff, arrayDaysOff, arrayHours, arrayBooks) => {
        const arrayData = []
        days60DaysOff.map((date, index) => {
            const arrayServices = []
            index < 7 && servicesChoice &&
            servicesChoice.map((service,i) => {
                arrayStaff
                    .filter(staff => service[staff.id])
                    .filter(staff => staff[_dayString(date)])
                    .filter(staff => service.idStaff === "Sans préférences" ? staff.id : staff.id === service.idStaff)
                    .map(staff => {
                        arrayDaysOff.filter(dayOff => dayOff.emetteur === staff.id && date >= dayOff.startInt && date <= dayOff.endInt).length === 0 && 
                        arrayHours
                            .filter(hour => hour.emetteur === staff.id)
                            .filter(hour => hour.day === _dayString(date))
                            .map(hour => {
                                for (let time = _convertTimeToMinutes(hour.start); time <= _convertTimeToMinutes(hour.end) - parseInt(service.duration); time += 15) {
                                    // si staff est égal // time est out de la réservation 
                                    let isBook = arrayBooks
                                        .filter(book => book.staffId === staff.id)
                                        .filter(book => book.date === date)
                                        .filter(book => time >= book.time && time <= book.time + book.duration1 - 15)
                                    // console.log("useBookingClient isBook:", isBook.length)
                                    if (isBook.length === 0) {
                                        arrayServices.push({
                                            serviceId:service.id, 
                                            serviceName:service.name, 
                                            staffId:staff.id, 
                                            staffSurname:staff.surname,
                                            day:hour.day,
                                            time:time,
                                            level:i,
                                            date:date,
                                            duration:parseInt(service.duration)
                                        })
                                        // console.log("useBookingClient isBook egal 0")
                                    }
                                    // console.log("useBookingClient books 2", arrayBooks?.[0].staffId, arrayBooks?.[0].time, arrayBooks?.[0].duration1, time)
                                }
                        })
                })
                
            })
            if (arrayServices.length > 0) {
                arrayData.push({date:date, arrayServices})
            }
        })
        return arrayData
    }

    const _finalServices = (filterService3, numberServices, servicesChoice) => {
        let arrayData = []

        if (numberServices === 1) {
            filterService3.map(item => {
                let arrayTimes = []
                _24Hours().map(hour => {
                    let arrayStaff1 = [] 
                    item.arrayServices
                        .filter(service => service.level === 0)
                        .filter(service => service.time === hour)
                        .map(service => {
                            arrayStaff1.push({staffId:service.staffId, staffSurname:service.staffSurname}) 
                    }) 
                    if (arrayStaff1.length > 0) {
                        arrayTimes.push({hour:hour, arrayStaff1:arrayStaff1})
                    }
                })
                if (arrayTimes.length > 0) {
                    arrayData.push({date:item.date, service1:servicesChoice[0].name, arrayTimes:arrayTimes})
                }
            })
        }

        if (numberServices === 2) {
            filterService3.map(item => {
                let arrayTimes = []
                _24Hours().map(hour => {

                    let arrayStaff1 = []
                    item.arrayServices
                        .filter(service1 => service1.level === 0)
                        .filter(service1 => service1.time === hour)
                        .map(service1 => {
                            arrayStaff1.push({staffId:service1.staffId, staffSurname:service1.staffSurname})
                    })

                    let arrayStaff2 = []
                    item.arrayServices
                        .filter(service2 => service2.level === 1)
                        .filter(service2 => service2.time === hour + parseInt(servicesChoice[0].duration))
                        .map(service2 => {
                            arrayStaff2.push({staffId:service2.staffId, staffSurname:service2.staffSurname})
                    })
                    if (arrayStaff1.length > 0  && arrayStaff2.length > 0) {
                        arrayTimes.push({hour:hour, arrayStaff1:arrayStaff1, arrayStaff2:arrayStaff2})
                    }

                })
                if (arrayTimes.length > 0) {
                    arrayData.push({date:item.date, service1:servicesChoice[0].name, service2:servicesChoice[1].name, arrayTimes:arrayTimes})
                }
            })
        }

        if (numberServices === 3) {
            filterService3.map(item => {
                let arrayTimes = []
                _24Hours().map(hour => {

                    let arrayStaff1 = []
                    item.arrayServices
                        .filter(service1 => service1.level === 0)
                        .filter(service1 => service1.time === hour)
                        .map(service1 => {
                            arrayStaff1.push({staffId:service1.staffId, staffSurname:service1.staffSurname})
                    })

                    let arrayStaff2 = []
                    item.arrayServices
                        // hour service1 = 10:00 // 
                        .filter(service2 => service2.level === 1)
                        .filter(service2 => service2.time === hour + parseInt(servicesChoice[0].duration))
                        .map(service2 => {
                            arrayStaff2.push({staffId:service2.staffId, staffSurname:service2.staffSurname})
                    })

                    let arrayStaff3 = []
                    item.arrayServices
                        .filter(service3 => service3.level === 2)
                        .filter(service3 => service3.time === hour + parseInt(servicesChoice[0].duration) + parseInt(servicesChoice[1].duration))
                        .map(service3 => {
                            arrayStaff3.push({staffId:service3.staffId, staffSurname:service3.staffSurname})
                    })
                    if (arrayStaff1.length > 0  && arrayStaff2.length > 0  && arrayStaff3.length > 0) {
                        arrayTimes.push({hour:hour, arrayStaff1:arrayStaff1, arrayStaff2:arrayStaff2, arrayStaff3:arrayStaff3})
                    }

                })
                if (arrayTimes.length > 0) {
                    arrayData.push({date:item.date, service1:servicesChoice[0].name, service2:servicesChoice[1].name, service3:servicesChoice[2].name, arrayTimes:arrayTimes})
                }
            })
        }

        return arrayData
    }

    const _convertTimeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }

    const _daysInt60 = (totalDays) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const arrayDays60 = []

        for (let i = 0; i < totalDays; i++) {
            const date = addDays(new Date(today), i)
            date.setHours(0, 0, 0, 0)
            const dateInt = date.getTime()
            arrayDays60.push(dateInt)
        }

        return arrayDays60
    }

    const _24Hours = () => {
        let array = []
        for (let i = 0; i < 14400; i+= 15) {
            array.push(i)
        }
        return array
    }

    const _dayString = (date) => {
        const dayString = format(new Date(date), 'EEEE', { locale: fr })
        return dayString
    }

    return {
        _displayPlanningFinal
    }
}

export default usePlanningClient























