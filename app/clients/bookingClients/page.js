'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderClients from '@/components/clients/HeaderClients'
import ChoiceServiceClient from '@/components/clients/bookingClient/ChoiceServiceClient'
import ModalAlert from '@/components/modals/ModalAlert'
// NEXT 
import Image from 'next/image'
import { useRouter } from 'next/navigation'
// IMAGES 
import imageDelete from '@/public/assets/images/delete.png'
import { IoIosArrowDown } from "react-icons/io"
import { IoIosArrowUp } from "react-icons/io"
// MUI 
import { Card, CardContent, FormControl, MenuItem, Select } from '@mui/material'
// DATE FNS 
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// HOOKS 
import usePlanningClient from '@/hooks/usePlanningClient'
// MODELS 
import { MODEL_COLOR } from '@/models/ModelColor'

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
    const [valueColor, setValueColor] = useState('')
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
            const themeStored = localStorage.getItem("themeColor")
            if (themeStored) {
                setValueColor(themeStored)
            } else {
                setValueColor("")
                localStorage.setItem("themeColor", "")
            }
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

    const _dateString = (date) => {
        // const dateString = format(new Date(date), "eeee dd MMMM yyyy", { locale:fr })
        const dateString = format(new Date(date), "eeee dd MMMM", { locale:fr })
        return dateString
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

            const dataBook = { 
                date: item.date,
                dateString:_dateString(item.date),
                time:booking.hour,
                timeString:_convertMinutesToHHMM(booking.hour),
                arrayStaff1:booking.arrayStaff1,
            }

            localStorage.setItem('dataBook', JSON.stringify(dataBook))

            router.push("/clients/bookingClients/bookingClientConfirm")

        } else { 
            setOpenModalAlert(true) 
        }
    }

    const _handleCloseModalAlert = () => {
        setOpenModalAlert(false)
        router.push("/auth/signin")
    }

    const getLightColor = (color) => {
        const colors = {
            green:'#cdf1dc',
            blue:'#9bb8e3',
            pink:'#ed9999ff',
            orange:'#fcf4ec',
            brown:'#a57a4f',
            pink:'#fcecec',
            purple:'#f4ecfc'
          // Ajoutez plus de mappages selon vos besoins
        }
        return colors[color] || "lightblue"
    }

    return (
        <div>

            <HeaderClients title="Retour" />

            <div className="text-center mt-3">{_customTitle()}</div>

            {/* LIST SERVICES STORED */}
            {servicesStorage && servicesStorage.map((service, index) => (
                <div key={index} className="mt-3 mx-3">
                    <div className="mt-3 px-3 py-6 mx-2" style={{ border:`1px solid ${MODEL_COLOR[valueColor]}`}}>
                    {/* <Card>
                        <CardContent> */}
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
                        {/* </CardContent>
                    </Card> */}
                    </div>
                </div>
            ))} 

            {/* IF NOT SERVICE */}
            {!servicesStorage || servicesStorage?.length === 0 && 
                <ChoiceServiceClient _handleChoiceService={_handleChoiceService} services={services} lists={lists} valueColor={valueColor} />
            }

            {!servicesStorage && 
                <ChoiceServiceClient _handleChoiceService={_handleChoiceService} services={services} lists={lists} valueColor={valueColor} />
            }

            {/* IF SERVICES STORED < 3 */}
            {showServices && 
                <ChoiceServiceClient _handleChoiceService={_handleChoiceService} services={services} lists={lists} valueColor={valueColor} />
            }

            {/* ASK MORE SERVICES */}
            {servicesStorage?.length > 0 && servicesStorage?.length < 3 && !showServices && !showConfirmBooking &&
                <div className="text-center p-3" onClick={() => setShowServices(true)}>
                    <button className="myButtonGrey">{"Ajouter un service"}</button>
                </div> 
            }

            {showServices && servicesStorage?.length > 0 && 
                <div className="text-center pt-3" onClick={() => setShowServices(false)}>Fermer</div>
            }

            <div className="border-t-2" />

            {_displayPlanningFinal(servicesStorage, staffs, services, daysOff, hours, profil, proId, books).map((item, index) => (
                numberDays > index &&
                <div className="mt-3" key={index}>
                    {/* <Card>
                        <CardContent style={{ border:`1px solid ${MODEL_COLOR[valueColor]}`}}>
                            <div className="flex justify-between" onClick={() => setShowDay(showDay === item.date ? "" : item.date)}>
                                <div>{_dateString(item.date)}</div>
                                {showDay === item.date ? 
                                    <IoIosArrowUp style={{ height:20, width:20 }} /> : <IoIosArrowDown style={{ height:20, width:20 }} />
                                }
                            </div> 
                        </CardContent>
                    </Card> */}
                    <div className="mt-3 px-3 py-6 mx-2" style={{ border:`1px solid ${MODEL_COLOR[valueColor]}`}}>
                        <div className="flex justify-between" onClick={() => setShowDay(showDay === item.date ? "" : item.date)}>
                            <div>{_dateString(item.date)}</div>
                            {showDay === item.date ? 
                                <IoIosArrowUp style={{ height:20, width:20 }} /> : <IoIosArrowDown style={{ height:20, width:20 }} />
                            }
                        </div>
                    </div>

                    {showDay === item.date && 
                    <div className="flex flex-wrap">
                        {item.arrayTimes.map((booking,index2) => ( 
                            <div key={index2} className="mx-2">
                                {_dateString(item.date) === todayDate && currentHour > booking.hour ? "" :
                                <button className={`myButton${valueColor}`} onClick={() => _handleBooking(item, booking)}>{_convertMinutesToHHMM(booking.hour)}</button>}
                            </div>
                        ))}
                    </div>
                    }

                </div>
            ))}

            <div style={{ height:400 }} />

            <ModalAlert 
                title={"Vous devez vous identifier pour réserver."}
                handleClose={_handleCloseModalAlert}
                open={openModalAlert}
            />
            
        </div>
    )
}

export default BookingClients





