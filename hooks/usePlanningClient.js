// DATE FNS
import { format, addDays, parse, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'

const usePlanningClient = () => {

    const _displayPlanningFinal = (servicesStorage, staffs, services, daysOff, hours, profil, proId) => {

        // nombre total de jours (semaines de réservations * 7)
        const numberWeek = profil.filter(profil => profil.proId === proId).map(pro => pro.numberWeek)
        const totalDays = numberWeek[0] * 7

        // faire une copie de chaque array
        const arrayStaff = []
        const arrayService = []
        const arrayDaysOff = []
        const arrayHours = []

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayInt = today.getTime()

        const staffMap = staffs.map(staff => arrayStaff.push(staff))
        const serviceMap = services.map(service => arrayService.push(service))
        // filter seulement les jours qui debut ce jour
        const daysOffMap = daysOff.filter(dayOff => dayOff.endInt >= todayInt).map(dayOff => arrayDaysOff.push(dayOff))
        //  .filter(dayOff => dayOff.startInt <= ta)
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

        const arrayHoursAvailables = []

        if (numberServices > 0) {

        days60DaysOff.map(date => {

            // array qui va contenir tous les éléments séléctionnés (pour un jour précis)
            const arrayService1 = []
            const arrayService2 = []
            const arrayService3 = []

            // afficher les staff disponibles ou le staff séléctionné
            _arrayStaff(arrayStaff,servicesChoice[0],date,arrayDaysOff).map(staff => {

                // filter les heures de présences en fonction du staff et du jour
                _arrayHours(arrayHours,staff,date).map(hour => {

                    // boucler toutes les heures disponibles à la réservation
                    for (let time = _convertTimeToMinutes(hour.start); time <= _convertTimeToMinutes(hour.end) - parseInt(servicesChoice[0].duration); time += 15) {

                        // nombre de services 
                        if (numberServices === 1) {
                            // si 1 service enregistrer les heures
                            // console.log('usePlanningClient arrayHoursAvailables:', time, staff.surname, servicesChoice[0].name)
                            arrayService1.push({time, idStaff:staff.id, idService:servicesChoice[0].id})
                        }

                        if (numberServices === 2) {
                            // si il y a 2 services demander si le créneau du deuxieme service correspond a la suite du premier service 
                            if (_isStaffNextHours(arrayStaff,date,arrayDaysOff,arrayHours,servicesChoice,1,time+parseInt(servicesChoice[0].duration))) {
                                // si oui enregistrer les horaires 
                                arrayService2.push({time, idStaff:staff.id, idService:servicesChoice[1].id})
                                if (arrayService2.length > 0) {
                                    arrayService1.push({time, idStaff:staff.id, idService:servicesChoice[0].id, arrayService2})
                                }
                            }
                            
                        }

                        if (numberServices === 3) {
                            // demander si il y a un service derriere le service 1 et 2
                            if (_isStaffNextHours(arrayStaff,date,arrayDaysOff,arrayHours,servicesChoice,1,time+parseInt(servicesChoice[0].duration))) {
                                if (_isStaffNextHours(arrayStaff,date,arrayDaysOff,arrayHours,servicesChoice,2,time+parseInt(servicesChoice[1].duration))) {
                                    arrayService3.push({time, idStaff:staff.id, idService:servicesChoice[2].id})
                                    if (arrayService3.length > 0) {
                                        arrayService2.push({time, idStaff:staff.id, idService:servicesChoice[1].id, arrayService3})
                                        if (arrayService2.length > 0) {
                                            arrayService1.push({time, idStaff:staff.id, idService:servicesChoice[0].id,arrayService2})
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                })
            })

            // si ce jour il y a des horaires disponiblent les sauvegarder
            if (arrayService1.length > 0) {
                arrayHoursAvailables.push({date, arrayService1})
            }
        })}


        // -------------------------------------------------------------------------------------------------------------------------

        const filterService3 =  _filterService3(days60DaysOff, servicesChoice, arrayStaff, arrayDaysOff, arrayHours)
        const finalServices = _finalServices(filterService3, numberServices)

        return finalServices

        // return []

    }

    const _filterService3 = (days60DaysOff, servicesChoice, arrayStaff, arrayDaysOff, arrayHours) => {
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

    const _finalServices = (filterService3, numberServices) => {
        // je crée un tableau pour récupérer tous créneaux après avoir été filtrés 
        let arrayData = []

        // si il y a au moins un service de selectionné
        if (numberServices > 0) {

            // je boucle les créneaux correspondants
            filterService3.map(item => {

                // je crée un tableau pour récupérer les créneaux du niveau 1
                let level1 = []

                _24Hours().map(hour => {
                    item.arrayServices
                        .filter(service1 => service1.level === 0)
                        .filter(service1 => service1.time === hour)
                        .map((service1, index) => {
                            if (index === 0) {
                                console.log('usePlanningClient', service1.time, index)
                            }
                    })
                })

                // BOUCLE SERVICE 1 
                item.arrayServices.filter(service1 => service1.level === 0).map(service1 => {

                    if (numberServices === 1) {

                        // SAUVEGARDE BOUCLE 1  
                        level1.push({
                            serviceId:service1.serviceId, 
                            serviceName:service1.serviceName, 
                            day:service1.day,
                            time:service1.time,
                            duration:parseInt(service1.duration),
                            staffId:service1.staffId, 
                            staffSurname:service1.staffSurname,
                        })
                    }

                    // faire une boucle level 2 en coérences avec la boucle level 1
                    if (numberServices === 2) {

                        const isTime = item.arrayServices
                        .filter(service2 => service2.level === 1)
                        .filter(service2 => service2.time === service1.time + service1.duration) 

                        // console.log('usePlanningClient isTime:', isTime.length)

                        let level2 = [] 
                        item.arrayServices
                            .filter(service2 => service2.level === 1)
                            .filter(service2 => service2.time === service1.time + service1.duration)
                            .map(service2 => {
    
                                let arrayStaff2 = []
                                // BOUCLE SERVICE 2 STAFF
                                item.arrayServices
                                    .filter(service2f => service2f.level === 1)
                                    .filter(service2f => service2f.time === service1.time + service1.duration)
                                    .map(service2f => {
                                        // ENREGISTREMENT STAFF BOUCLE 2
                                        arrayStaff2.push({
                                            staffId:service2f.staffId,
                                            staffSurname:service2f.staffSurname
                                        })
                                })

                                // BOUCLE SERVICE 1 STAFF 
                                let arrayStaff1 = []
                                item.arrayServices
                                    .filter(service => service.level === 0)
                                    .filter(service => service.time === service1.time)
                                    .map(service => {
                                        // ENREGISTREMENT STAFF BOUCLE 1
                                        arrayStaff1.push({
                                            staffId:service.staffId,
                                            staffSurname:service.staffSurname
                                        })
                                })

                                // SAUVEGARDE BOUCLE 1  
                                level1.push({
                                    day:service1.day,
                                    // service 1
                                    serviceId1:service1.serviceId, 
                                    serviceName1:service1.serviceName, 
                                    duration1:parseInt(service1.duration),
                                    arrayStaff1:arrayStaff1,
                                    time1:service1.time,
                                    // service 2
                                    serviceId2:service2.serviceId, 
                                    serviceName2:service2.serviceName, 
                                    duration2:parseInt(service2.duration),
                                    arrayStaff2:arrayStaff2,
                                    time2:service2.time,
                                })
                        })
                    }

                    if (numberServices === 3) {

                        let level2 = [] 
                        item.arrayServices
                            .filter(service2 => service2.level === 1)
                            .filter(service2 => service2.time === service1.time + service1.duration)
                            .map(service2 => {

                                item.arrayServices
                                    .filter(service3 => service3.level === 2)
                                    // .filter(service3 => service3.time === service2.time + service2.duration)
                                    .map(service3 => {

                                        // BOUCLE SERVICE 3 STAFF 
                                        let arrayStaff3 = []
                                        item.arrayServices
                                            .filter(service3f => service3f.level === 2)
                                            .filter(service3f => service3f.time === service2.time + service2.duration)
                                            .map(service3f => {
                                                // ENREGISTREMENT STAFF BOUCLE 1
                                                arrayStaff3.push({
                                                    staffId:service3f.staffId,
                                                    staffSurname:service3f.staffSurname
                                                })
                                        })

                                        let arrayStaff2 = []
                                        // BOUCLE SERVICE 2 STAFF
                                        item.arrayServices
                                            .filter(service2f => service2f.level === 1)
                                            .filter(service2f => service2f.time === service1.time + service1.duration)
                                            .map(service2f => {
                                                // ENREGISTREMENT STAFF BOUCLE 2
                                                arrayStaff2.push({
                                                    staffId:service2f.staffId,
                                                    staffSurname:service2f.staffSurname
                                                })
                                        })
        
                                        // BOUCLE SERVICE 1 STAFF 
                                        let arrayStaff1 = []
                                        item.arrayServices
                                            .filter(service => service.level === 0)
                                            .filter(service => service.time === service1.time)
                                            .map(service => {
                                                // ENREGISTREMENT STAFF BOUCLE 1
                                                arrayStaff1.push({
                                                    staffId:service.staffId,
                                                    staffSurname:service.staffSurname
                                                })
                                        })
        
                                        // SAUVEGARDE BOUCLE 1  
                                        level1.push({
                                            day:service1.day,
                                            time:service1.time,
                                            // service 1
                                            serviceId1:service1.serviceId, 
                                            serviceName1:service1.serviceName, 
                                            duration1:parseInt(service1.duration),
                                            arrayStaff1:arrayStaff1,
                                            // service 2
                                            serviceId2:service2.serviceId, 
                                            serviceName2:service2.serviceName, 
                                            duration2:parseInt(service2.duration),
                                            arrayStaff2:arrayStaff2,
                                            // service 2
                                            serviceId3:service3.serviceId, 
                                            serviceName3:service3.serviceName, 
                                            duration3:parseInt(service3.duration),
                                            arrayStaff3:arrayStaff3,
                                        })
                                })
                        })

                    }
                })


                // si il y a des creneaux qui correspondent au jour séléctionné 
                if (level1.length > 0) {
                    arrayData.push({date:item.date, level1})
                    // console.log('usePlanning arrayLevel1:', level1)
                    // arrayData.push({date:item.date, level1})
                }

            })
        }

        // console.log('usePlanningClient', arrayData)

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

    const _arrayStaff = (arrayStaff,service,date,arrayDaysOff) => {
        let array = []
        arrayStaff
            .filter(staff => service[staff.id])
            .filter(staff => staff[_dayString(date)])
            .filter(staff => service.idStaff === "Sans préférences" ? staff.id : staff.id === service.idStaff)
            .map(staff => {
                const isClose = arrayDaysOff
                                .filter(dayOff => dayOff.emetteur === staff.id && date >= dayOff.startInt && date <= dayOff.endInt)
                                .length === 0 && array.push(staff)
                })
        return array
    }

    const _isStaffNextHours = (arrayStaff,date,arrayDaysOff,arrayHours,servicesChoice,index,time) => {
        let array = []
        _arrayStaff(arrayStaff,servicesChoice[index],date,arrayDaysOff).map(staff => {
            _arrayHours(arrayHours,staff,date).map(hour => {
                if (
                    time >= _convertTimeToMinutes(hour.start) 
                && 
                    time  <= _convertTimeToMinutes(hour.end) - parseInt(servicesChoice[index].duration)
                ) {
                    array.push('true')
                }
            })
        })

        if (array.length > 0) return true

    }

    const _arrayHours = (arrayHours,staff,date) => {
        const array = []
        arrayHours.filter(hour => hour.emetteur === staff.id && hour.day === _dayString(date)).map(hour => {
            array.push(hour)
        })
        return array
    }

    return {
        _displayPlanningFinal
    }
}

export default usePlanningClient























