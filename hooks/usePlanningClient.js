// DATE FNS 
import { format, addDays, parse, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'

const usePlanningClient = () => {

    const _displayPlanningFinal = (servicesStorage, staffs, services, daysOff, hours, profil, proId) => {

        const numberWeek = profil.filter(profil => profil.proId === proId).map(pro => pro.numberWeek)
        const totalDays = numberWeek[0] * 7
        console.log('usePlanning ', totalDays)

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
        const hoursMaps = hours.map(hour => arrayHours.push(hour))


        // filter les staff ok pour les services 
        const staffServices = []
        servicesStorage?.map(serviceStorage => {
            arrayService.filter(service => service.id === serviceStorage.id).map(service => {
                let array = []
                arrayStaff.filter(staff => service[staff.id]).map(staff => {
                    array.push(staff)
                })
                staffServices.push({service,array})
            })
        })

        // recuperer les 60 prochains jours  moins les jours de fermetures
        const days60 = _daysInt60(totalDays)
        const days60DaysOff = days60.filter(day60 => {
            return !arrayDaysOff.filter(dayOff => dayOff.emetteur === "pro").some(dayOff => {
                return day60 >= dayOff.startInt && day60 <= dayOff.endInt
            })
        })

        const arrayHoursAvailables = [];

        days60DaysOff.map(date => {
            let dateString = format(new Date(date), 'EEEE', { locale: fr });
            let timeStaffMap = {};
        
            staffServices.forEach(service => {
                service.array.forEach(staff => {
                    if (staff[dateString]) {
                        arrayHours.filter(hour => hour.emetteur === staff.id).forEach(hour => {
                            for (let time = _convertTimeToMinutes(hour.start); time <= _convertTimeToMinutes(hour.end); time += 15) {
                                if (!timeStaffMap[time]) {
                                    timeStaffMap[time] = new Set();
                                }
                                // Utilisez un objet JSON stringifié pour gérer les objets complexes comme des entrées uniques
                                timeStaffMap[time].add(JSON.stringify({ nameStaff: staff.name, idStaff: staff.id }));
                            }
                        });
                    }
                });
            });
        
            let staffAvailable = Object.keys(timeStaffMap).map(time => {
                let uniqueStaff = Array.from(timeStaffMap[time]).map(staffStr => JSON.parse(staffStr));
                return { time, staff: uniqueStaff };
            });
        
            if (staffAvailable.length > 0) {
                arrayHoursAvailables.push({ date, staffAvailable });
            }
        })
    
        return arrayHoursAvailables;
        
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


    return {
        _displayPlanningFinal
    }
}

export default usePlanningClient