'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderClients from '@/components/clients/HeaderClients'
import ChoiceServiceClient from '@/components/clients/bookingClient/ChoiceServiceClient'
// NEXT 
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
// HOOKS 
import usePlanningClient from '@/hooks/usePlanningClient'
import ModalAlert from '@/components/modals/ModalAlert'

const BookingClients = () => {
    const { _readDaysOff, daysOff, _readStaffs, staffs, _readServices, services, _readHours, hours, _readLists, lists, _readProfil, profil, _readBooks, books, _writeData } = useFirebase()
    const { _displayPlanningFinal } = usePlanningClient()
    const [isAuth, setIsAuth] = useState()
    const [servicesStorage, setServicesStorage] = useState()
    const [count, setCount] = useState(1)
    const [todayDate, setTodayDate] = useState()
    const [currentHour, setCurrentHour] = useState()
    const [showServices, setShowServices] = useState(false)
    const [showDay, setShowDay] = useState()
    const [proId, setProId] = useState()
    const [numberDays, setNumberDays] = useState(7)
    const [openModalAlert, setOpenModalAlert] = useState(false)
    const [showConfirmBooking, setShowConfirmBooking] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            // get services storage 
            let servicesData = JSON.parse(localStorage.getItem("services"))
            // set services for show in render
            setServicesStorage(servicesData)
            // close choice services 
            setShowServices(false)
            const today = new Date()
            const formattedDate = format(today, 'eeee dd MMMM', { locale: fr })
            setTodayDate(formattedDate)
            const hours = today.getHours()
            const minutes = today.getMinutes()
            setCurrentHour(hours * 60 + minutes)
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[count])

    useEffect(() => {
        const auth = localStorage.getItem("isAuth")
        const authData = auth ? JSON.parse(auth) : [] 
        setIsAuth(authData)
    },[])

    useEffect(() => {
        if (proId) {
            _readDaysOff(proId)
            _readStaffs(proId)
            _readServices(proId)
            _readHours(proId)
            _readLists(proId)
            _readProfil(proId)
            _readBooks(proId)
        }
    },[proId])

    const _handleRemove = () => {
        localStorage.removeItem('services')
        setCount(count + 1)
        setServicesStorage([])
    }

    const _handleRemoveService = (idStorage) => {
            console.log('bookingClients _handleRemoveService ', )
            // filter array / créer une copie du tableau de service en storage et le retourner sans celui selectionner 
            const servicesFilter = servicesStorage.filter(item => item.idStorage !== idStorage)
            // put in storage / mettre en mémoire le tableau filtré
            localStorage.setItem('services', JSON.stringify(servicesFilter))
            setCount(count + 1)
            localStorage.removeItem("dataBook")
            setShowConfirmBooking(false)

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

    const _handleChangeStaff = (service,idStaff) => {

        const monTableau = servicesStorage 

        const array = []

        monTableau.map(serviceStored => {
            if (serviceStored.idStorage === service.idStorage) {
                array.push({...service, idStaff})
            } else {
                array.push(serviceStored)
            }
        })
        
        localStorage.setItem('services', JSON.stringify(array))
        setCount(count + 1)
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

        // services [0] 
        console.log('planning service', servicesStorage)

        const daysHoursFinals = []

        

        // filter le service selectionné 
        // services.filter(service => service.id === servicesStorage[0]?.id).map(service => { 
        //     console.log('BookingClients _showDayFinal', service.name)
        //     // quel équipier peux réaliser le service ? 
        //     staffs.filter(staff => service[staff.id]).map(staff => {
        //         console.log('BookingClients _showDayFinal', service.name, staff.name) 
        //         // maper sur 60 jours 
        //         _days60().map(day => {

        //             daysOff
        //                 .filter(dayOff => dayOff.emetteur === "pro" && dayOff === staff.id).map(dayOff => {

        //                 day >= dayOff.startInt && day <= dayOff.endInt && '' 



        //                 // filter les jours off du salon et du staff
        //                 // day >= dayOff.startInt && day <= dayOff.endInt ? null :
                        
        //             })

        //             console.log('BookingClients _showDayFinal daysOff', service.name, staff.name, _dateString(day))

        //         })
        //     })
        // }) 

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

    const _handleChoiceService = (service) => {
        let choiceData = localStorage.getItem("services")
        let serviceData = JSON.parse(choiceData)
        serviceData ? serviceData = serviceData : serviceData = []
        serviceData.push({...service, idStorage:`id-${Date.now()}`, idStaff:"Sans préférences"})
        localStorage.setItem('services', JSON.stringify(serviceData))
        setCount(count + 1)
    }

    const _convertMinutesToHHMM = (minutes) => {
        let hours = Math.floor(minutes / 60)
        let mins = minutes % 60
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }
 
    const _handleBooking = (item, booking) => {

        // comment savoir si auth
        if (isAuth?.[proId]) {

            
            // si 1 service 
            if (servicesStorage.length === 1) {
                const choiceStaff = booking.arrayStaff1[Math.floor(Math.random() * booking.arrayStaff1.length)]
                const dataBook = {
                    date: item.date,
                    dateString: _dateString(item.date), 
                    service1:servicesStorage[0].name,
                    serviceId:servicesStorage[0].id,
                    time:booking.hour,
                    timeSTring:_convertMinutesToHHMM(booking.hour),
                    duration1:parseInt(servicesStorage[0].duration),
                    staffId:choiceStaff.staffId,
                    staffSurname:choiceStaff.staffSurname,
                    arrayStaff1:booking.arrayStaff1,
                    authEmail:isAuth.email,
                    authId:isAuth.id,
                    authName:isAuth.name,
                }
                localStorage.setItem("dataBook", dataBook)
                localStorage.setItem('dataBook', JSON.stringify(dataBook))
                
                setShowDay("")
                setShowConfirmBooking(true)
        }
            // comment sauvegarder 

        } else { 
            setOpenModalAlert(true) 
        }
    }

    const _handleConfirmBooking = () => {
        // confirm if ok 
        let getDataBook = localStorage.getItem("dataBook")
        let dataBook = JSON.parse(getDataBook)

        // comment vérifier qu'il n'y a pas eu une réservation entretemps 

        // console.log(`si le staff a une réservation entre ${dataBook.time} et ${dataBook.time + dataBook.duration1 - 15}`)

        books.filter(book => book.staffId === dataBook.staffId).map(book => {
            // console.log(`si le staff a une réservation entre ${book.time} et ${book.time + book.duration1 - 15}`)
        })

        // NIVEAU 1
        // je verifie si il n'y a pas eu une réservation avec le même staff au même créneaux avant d'enregistrer la réservation 

        if (servicesStorage[0].idStaff === "Sans préférences") {
            // y a t il déja une réservation 
            let isBooking = books
                .filter(book => book.staffId === dataBook.staffId)
                .filter(book => book.date === dataBook.date)
                .filter(book => book.time >= dataBook.time)
                
            if (isBooking.length === 0) {
                // si staff occuper proposer un autre staff (si selectionné) 
                // _writeData(`pro/${proId}/books`, dataBook)
                // router.push("/clients/homeClients")
                // localStorage.removeItem("dataBook")
                // localStorage.removeItem("services")
            }
            console.log('bookingClient _handleConfirmBooking servicesStorage:', servicesStorage[0].idStaff )
        } 

        if (servicesStorage[0].idStaff !== "Sans préférences") {

            // demander si le staff a une réservation au moment du creneau 
            // .filter(book => time >= book.time && time <= book.time + book.duration1 - 15)
            let isBooking = books
                .filter(book => book.staffId === dataBook.staffId)
                .filter(book => book.date === dataBook.date)
                .filter(book => book.time >= dataBook.time && book.time <= dataBook.time + dataBook.duration1 - 15)

            if (isBooking.length === 0) {
                _writeData(`pro/${proId}/books`, dataBook)
                router.push("/clients/homeClients")
                localStorage.removeItem("dataBook")
                localStorage.removeItem("services") 
            }

            // créneau a réserver 
            // console.log('bookingClient _handleConfirmBooking créneau:', `${dataBook.time} et ${dataBook.time + dataBook.duration1 - 15}` )

            // console.log('bookingClient _handleConfirmBooking servicesStorage:', servicesStorage[0].idStaff )

        }

    }

    const _handleCloseModalAlert = () => {
        setOpenModalAlert(false)
        router.push("/auth/signin")
    }

    return (
        <div>

            <HeaderClients title="Retour" />

            <div className="text-center mt-3">{_customTitle()}</div>

            {/* LIST SERVICES STORED */}
            {servicesStorage && servicesStorage.map((service, index) => (
                <div key={index} className="mt-3 mx-3">
                    <Card>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div>{service.name}</div>
                                </div>
                                <div onClick={() => _handleRemoveService(service.idStorage)}>
                                    <Image src={imageDelete} className='img-fluid' alt='image calendar' style={{ height:20, width:20 }} />
                                </div>
                            </div>
                            <div className="m-3">
                                <FormControl>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={service.idStaff || "Sans préférences"}
                                        label="Age"
                                        // onChange={() => _handleChangeStaff(service)}
                                        style={{ width: 180, height: 40 }}
                                    >
                                        <MenuItem value="Sans préférences" onClick={() => _handleChangeStaff(service, "Sans préférences")}>
                                            Sans préférences
                                        </MenuItem>
                                        {staffs.filter(staff => service[staff.id]).map(staff => (
                                            <MenuItem value={staff.id} key={staff.id} onClick={() => _handleChangeStaff(service, staff.id)}>
                                                {staff.surname}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}

            {/* IF NOT SERVICE */}
            {!servicesStorage || servicesStorage?.length === 0 && 
                <ChoiceServiceClient _handleChoiceService={_handleChoiceService} services={services} lists={lists} />
            }

            {!servicesStorage && 
                <ChoiceServiceClient _handleChoiceService={_handleChoiceService} services={services} lists={lists} />
            }

            {/* IF SERVICES STORED < 3 */}
            {showServices && 
                <ChoiceServiceClient _handleChoiceService={_handleChoiceService} services={services} lists={lists} />
            }

            {/* ASK MORE SERVICES */}
            {servicesStorage?.length > 0 && servicesStorage?.length < 3 && !showServices && !showConfirmBooking &&
                <div className="text-center p-3" onClick={() => setShowServices(true)}>Ajouter un service</div> 
            }

            {showServices && servicesStorage?.length > 0 && 
                <div className="text-center pt-3" onClick={() => setShowServices(false)}>Fermer</div>
            }

            <div className="border-t-2" />

            {showConfirmBooking ? 
                <div className="flex justify-center mt-3">
                    <button className="myButton" onClick={_handleConfirmBooking}>Confirmer</button>
                </div>
            : 

                <>
                    {_displayPlanningFinal(servicesStorage, staffs, services, daysOff, hours, profil, proId, books).map((item, index) => (
                        numberDays > index &&
                        <div className="mt-3 mx-3" key={index}>
                            <Card>
                                <CardContent>
                                    <div className="flex justify-between" onClick={() => setShowDay(showDay === item.date ? "" : item.date)}>
                                        <div>{_dateString(item.date)}</div>
                                        {showDay === item.date ? 
                                            <IoIosArrowUp style={{ height:20, width:20 }} /> : <IoIosArrowDown style={{ height:20, width:20 }} />
                                        }
                                    </div> 
                                </CardContent>
                            </Card>

                            {}

                            {showDay === item.date && 
                            <div className="flex flex-wrap">
                                {item.arrayTimes.map((booking,index2) => (
                                    <div key={index2} className="ms-1 me-1">
                                        {_dateString(item.date) === todayDate && currentHour > booking.hour ? "" :
                                        <button className="myButton" onClick={() => _handleBooking(item, booking)}>{_convertMinutesToHHMM(booking.hour)}</button>}
                                    </div>
                                ))}
                            </div>
                            }

                        </div>
                    ))}
                </>
            
            }

            <div className="flex justify-center mt-3">
                <button className="myButton" onClick={() => [setShowConfirmBooking(false)]}>tester</button>
            </div>

            <div style={{ height:400 }} />

            <ModalAlert 
                title={"Vous devez vous identifier pour réserver."}
                handleClose={_handleCloseModalAlert}
                open={openModalAlert}
            />

            {/* ModalAlert = ({ handleClose, open, title }) */}
            
        </div>
    )
}

export default BookingClients





