'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderClients from '@/components/clients/HeaderClients'
import ChoiceServiceClient from '@/components/clients/bookingClient/ChoiceServiceClient'
// NEXT 
import Image from 'next/image'
// IMAGES 
import imageDelete from '@/public/assets/images/delete.png'
import { IoIosArrowDown } from "react-icons/io"
import { IoIosArrowUp } from "react-icons/io"
// MUI 
import { Card, CardContent, Divider, FormControl, MenuItem, Select } from '@mui/material'
// DATE FNS 
import { format, addDays, parse, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'

const BookingClients = () => {
    const { _readDaysOff, daysOff, _readStaffs, staffs, _readServices, services, _readHours, hours } = useFirebase()
    const [servicesStorage, setServicesStorage] = useState([])
    const [count, setCount] = useState(1)
    const [age, setAge] = useState(0)
    const [todayDate, setTodayDate] = useState()
    const [showServices, setShowServices] = useState(false)
    const [showDay, setShowDay] = useState()
    const [numberRender, setNumberRender] = useState(7)
    const [proId, setProId] = useState()

    useEffect(() => {
        if (typeof window !== "undefined") {
            // get services storage 
            let servicesData = JSON.parse(localStorage.getItem("services"))
            // set services for show in render
            setServicesStorage(servicesData)
            // close choice services 
            setShowServices(false)
            const today = new Date()
            const formattedDate = format(today, 'eeee dd MMMM yyyy', { locale: fr })
            setTodayDate(formattedDate)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[count])

    useEffect(() => {
        if (proId) {
            _readDaysOff(proId)
            _readStaffs(proId)
            _readServices(proId)
            _readHours(proId)
        }
    },[proId])

    const _handleRemove = () => {
        localStorage.removeItem('services')
        setCount(count + 1)
        setServicesStorage([])
    }

    const _handleRemoveService = (serviceId) => {
        // filter array / créer une copie du tableau de service en storage et le retourner sans celui selectionner 
        const servicesFilter = servicesStorage.filter(item => item.id !== serviceId)
        // put in storage / mettre en mémoire le tableau filtré
        localStorage.setItem('services', JSON.stringify(servicesFilter))
        setCount(count + 1)
    }

    const _customTitle = () => {
        let numberServices = servicesStorage ? servicesStorage.length : 0
        let title = ""

        switch (numberServices) {
            case 0 :
                title="Choisir un service"
                break;
            case 1 :
                title="Service choisi"
                break;
            default:
                title="Services choisis"
        }
        return title
    }

    const _handleChangeStaff = (event) => {
        setAge(event.target.value)
    }

    const _displayDays = () => {

        const today = new Date() 
        today.setHours(0, 0, 0, 0) 
        
        const rawDates = [] 
        
        for (let i = 0; i < 60; i++) {
            const date = addDays(new Date(today), i) 
            date.setHours(0, 0, 0, 0) 
            const dateInt = date.getTime() 
            rawDates.push(dateInt) 
        }
    
        // filtrer en fonction des jours de fermetures du salon
        const daysOffSalon = daysOff?.filter(dayOff => dayOff.emetteur === "pro")

        const availableDates = rawDates.filter(rawDate => {
            return !daysOffSalon.some(dayOff => {
        
                // Convertir les chaînes de date en objets Date et réinitialiser les heures/min/sec/ms
                const start = new Date(dayOff.startInt)
                const end = new Date(dayOff.endInt)
        
                // Vérifier si la date 'rawDate' est dans l'intervalle [start, end]
                return rawDate >= start.getTime() && rawDate <= end.getTime()
            })
        })

        return availableDates
    }



    const _handleTest = () => {
        // date d'aujourd'hui 
        const today = new Date() 
        today.setHours(0, 0, 0, 0)
        const currentDay = format(new Date(today), "eeee", { locale:fr })

        const staffAvailables = []

        services.filter(service => service.id === servicesStorage[0].id).map(service => {
            staffs.filter(staff => staff[currentDay]).map(staff => {
                service[staff.id] ? staffAvailables.push(staff) : null
            })
        })

        // console.log('BookingClients _handleTest', staffAvailables)



        const hoursAvailables = []

        staffAvailables.forEach(staff => {
            hours.filter(hour => hour.emetteur === staff.id && hour.day === currentDay).forEach(hour => {
        
                // Convertir les heures de début et de fin en minutes
                const [startHours, startMinutes] = hour.start.split(':').map(Number)
                const [endHours, endMinutes] = hour.end.split(':').map(Number)
                const startTimeInMinutes = startHours * 60 + startMinutes
                const endTimeInMinutes = endHours * 60 + endMinutes
        
                // Itérer à travers chaque intervalle de 15 minutes et ajouter au tableau
                for (let time = startTimeInMinutes; time < endTimeInMinutes; time += 15) {
                    const hours = Math.floor(time / 60)
                    const minutes = time % 60
                    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
                    hoursAvailables.push({hours:timeString, staff:staff.name});
                }
            })
        })

        // console.log('BookingClients _handleTest', hoursAvailables)

        // le staff est-il disponible dans le créneaux horaires ? 

        return staffAvailables
    }

    const _dateString = (date) => {
        // const dateString = format(new Date(date), "eeee dd MMMM yyyy", { locale:fr })
        const dateString = format(new Date(date), "eeee dd MMMM", { locale:fr })
        return dateString
    }

    const _dayString = (date) => {
        const dayString = format(new Date(date), "eeee", { locale:fr })
        return dayString
    }

    const _handleShowDay = (day) => {
        if (showDay === day) {
            setShowDay()

        } else {
            setShowDay(day)
        } 
    }

    const _days60 = () => {
        const today = new Date() 
        today.setHours(0, 0, 0, 0) 
        const rawDates = [] 
        for (let i = 0; i < 60; i++) {
            const date = addDays(new Date(today), i) 
            date.setHours(0, 0, 0, 0) 
            const dateInt = date.getTime() 
            rawDates.push(dateInt) 
        }
        return rawDates
    }

    const _showDayFinal = () => {

        // console.log('BookingClients _handleTest', _days60()) 

        const daysHoursFinals = []

        // filter le service selectionné 
        services.filter(service => service.id === servicesStorage[0]?.id).map(service => { 
            console.log('BookingClients _showDayFinal', service.name)
            // quel équipier peux réaliser le service ? 
            staffs.filter(staff => service[staff.id]).map(staff => {
                console.log('BookingClients _showDayFinal', service.name, staff.name) 
                // maper sur 60 jours 
                _days60().map(day => {

                    daysOff
                        .filter(dayOff => dayOff.emetteur === "pro" && dayOff === staff.id).map(dayOff => {

                        day >= dayOff.startInt && day <= dayOff.endInt && '' 



                        // filter les jours off du salon et du staff
                        // day >= dayOff.startInt && day <= dayOff.endInt ? null :
                        
                    })

                    console.log('BookingClients _showDayFinal daysOff', service.name, staff.name, _dateString(day))

                })
            })
        }) 

    }

    const _filterDayOff = () => {
        const daysOffSalon = daysOff?.filter(dayOff => dayOff.emetteur === "pro")

        const availableDates = rawDates.filter(rawDate => {
            return !daysOffSalon.some(dayOff => {
        
                // Convertir les chaînes de date en objets Date et réinitialiser les heures/min/sec/ms
                const start = new Date(dayOff.startInt)
                const end = new Date(dayOff.endInt)
        
                // Vérifier si la date 'rawDate' est dans l'intervalle [start, end]
                return rawDate >= start.getTime() && rawDate <= end.getTime()
            })
        })
    }

    return (
        <div>

            <HeaderClients title="Retour" />

            <div className="text-center mt-3">{_customTitle()}</div>

            {servicesStorage && servicesStorage.map(service => (
                <div key={service.id} className="mt-3 mx-3">
                    <Card>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div>{service.name}</div>
                                </div>
                                <div onClick={() => _handleRemoveService(service.id)}>
                                    <Image src={imageDelete} className='img-fluid' alt='image calendar' style={{ height:20, width:20 }} />
                                </div>
                            </div>
                            <div className="m-3">
                                <FormControl>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={age}
                                        label="Age"
                                        onChange={_handleChangeStaff}
                                        style={{ width:180, height:40 }}
                                    >
                                        <MenuItem value={0}>Sans préférences</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={30}>30</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}

            {servicesStorage && servicesStorage.length === 0 ? <ChoiceServiceClient setCount={setCount} count={count} /> :
                !showServices ?
                    servicesStorage.length <= 3 ? 
                    <div className="text-center mt-3" onClick={() => setShowServices(true)}>Ajouter un service</div> :
                    <div className="text-center mt-3">Vous ne pouvez plus ajouter de services</div>
                : 
                    <ChoiceServiceClient setCount={setCount} count={count} />
            }

            <div className="border-t-2" />

            {/* {_displayDays().map((day, i) => (
                i < numberRender &&
                <div key={day}>
                    <div className="flex justify-between items-center p-3 shadow-md" onClick={() => _handleShowDay(day)}>
                        <div>{_dateString(day)}</div>
                        {showDay === day ? 
                            <IoIosArrowUp /> : 
                            <IoIosArrowDown />
                        }
                    </div>
                </div>
            ))} */}

            {_showDayFinal()}

            <div className="flex justify-center mt-3">
                <button className="myButton" onClick={_handleTest}>tester</button>
            </div>

            <div className="flex justify-center mt-3">
                <button className="myButtonRed" onClick={_handleRemove}>delete</button>
            </div>

            {/* {_handleTest().map(date => <div key={date}>{date}</div>)} */}

            {/* {_handleTest()} */}

            <div className="mt-3 mx-3">
                <Card>
                    <CardContent>
                        <div className="flex justify-between" onClick={() => setShowDay(!showDay)}>
                            <div>{todayDate}</div>
                            {!showDay ? 
                                <IoIosArrowDown style={{ height:20, width:20 }} /> : 
                                <IoIosArrowUp style={{ height:20, width:20 }} />
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="m-3">
                <FormControl>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Age"
                        onChange={_handleChangeStaff}
                        style={{ width:200 }}
                    >
                        <MenuItem value={0}>Sans préférences</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* <div>displayDays = {_displayDays().map(day => <div key={day}>{_dateString(day)}</div>)}</div> */}

            <div style={{ height:400 }} />
            
        </div>
    )
}

export default BookingClients





