'use client'
import React, { useEffect, useState } from 'react'
// COMPONENTS 
import HeaderPro from '@/components/pro/HeaderPro'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// IMAGES 
import imageAdd from '@/public/assets/images/addServices.png'
import imageDelete from '@/public/assets/images/delete.png'
import boxbluelight from '@/public/assets/images/boxbluelight.png'
import boxbluelightoff from '@/public/assets/images/boxbluelightoff.png'
import boxblue from '@/public/assets/images/boxblue.png'
import boxblueoff from '@/public/assets/images/boxblueoff.png'
import boxgreen from '@/public/assets/images/boxgreen.png'
import boxgreenoff from '@/public/assets/images/boxgreenoff.png'
import boxorange from '@/public/assets/images/boxorange.png'
import boxorangeoff from '@/public/assets/images/boxorangeoff.png'
import boxpink from '@/public/assets/images/boxpink.png'
import boxpinkoff from '@/public/assets/images/boxpinkoff.png'
import boxpurple from '@/public/assets/images/boxpurple.png'
import boxpurpleoff from '@/public/assets/images/boxpurpleoff.png'
import boxbrown from '@/public/assets/images/boxbrown.png'
import boxbrownoff from '@/public/assets/images/boxbrownoff.png'
// NEXT 
import Image from 'next/image'
import Link from 'next/link' 

const ParamPro = () => {
    const { _readDaysOff, daysOff, _deleteData, _readProfil, profil, _updateData } = useFirebase()
    const [proId, setProId] = useState()
    const [numberWeek, setNumberWeek] = useState(4)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
        }
    },[]) 

    useEffect(() => {
        if (proId) {
            _readDaysOff(proId)
            _readProfil(proId)
        }
    },[proId])

    useEffect(() => {
        profil?.filter(pro => pro.proId === proId).map(pro => {
            setNumberWeek(pro.numberWeek ? pro.numberWeek : 4)
        })
    },[profil])

    // DELETE DAY OFF 
    const _handleDeleteDaysOff = (id) => {
        _deleteData(`pro/${proId}/daysOff/${id}`)
    }

    // SUBSTRIDE WEEK NUMBER 
    const _subsribeWeekNumber = (id) => {
        if (numberWeek > 0) {
            const data = {
                numberWeek:numberWeek- 1
            }
            _updateData(`pro/${proId}/profil/${id}`, data)
        }
    }

    // ADD WEEK NUMBER 
    const _addWeekNumber = (id) => {
        if (numberWeek < 8) {
            const data = {
                numberWeek:numberWeek + 1
            }
            _updateData(`pro/${proId}/profil/${id}`, data)
        }
    }

    // THEME COLOR 
    const _handleColor = (id, color) => {
        const data = {
            themeColor:color
        }
        _updateData(`pro/${proId}/profil/${id}`, data)
    }

    return (
        <div>

            <HeaderPro title="Paramètres" />

            {profil?.filter(pro => pro.proId === proId).map(pro => (
                <div key={pro.id}>
                    <div className="border-b-2 p-3 mt-3">
                        <div className="flex justify-center gap-4 items-center p-3">
                            <div className='text-center'>Jours de fermetures</div>
                            <Link href={"/pro/paramPro/addDayOff"} className="flex justify-center">
                                <Image src={imageAdd} className='img-fluid' alt='image services' style={{ height:30, width:30 }} />
                            </Link>
                        </div>
                    </div>

                    {daysOff?.sort((a,b) => a.startInt - b.startInt).filter(dayOff => dayOff.emetteur === "pro").map(dayOff => (
                        <div key={dayOff.id} className="border-b-2 p-3 flex justify-between items-center">
                            <div>
                                <div>du {dayOff.startString}</div>
                                <div>au {dayOff.endString}</div>
                            </div>
                            <Image 
                                src={imageDelete} 
                                className='img-fluid' alt='image services' 
                                style={{ height:20, width:20 }} 
                                onClick={() => _handleDeleteDaysOff(dayOff.id)}
                            />
                        </div>
                    ))}

                    <div className="text-center border-b-2 p-3 flex justify-center items-center gap-4">
                        <div>Horaires du planning</div>
                        <Link href={"/pro/paramPro/hoursOpenPlanning"} className="flex justify-center">
                            <Image src={imageAdd} className='img-fluid' alt='image services' style={{ height:30, width:30 }} />
                        </Link>
                    </div>

                    <div className="border-b-2 p-3 text-center">de {pro.hoursStartPlanning} à {pro.hoursEndPlanning}</div>

                    {/* NBR WEEKS TO BOOKING */}
                    <div className="text-center mt-4">Nombre de semaines de réservations possible (max 8)</div>
                    <div className="flex justify-center p-3 items-center border-b-2">
                        <div className="text-3xl me-4" onClick={() => _subsribeWeekNumber(pro.id)}>-</div>
                        <div className="text-2xl">{numberWeek}</div>
                        <div className="text-3xl ms-4" onClick={() => _addWeekNumber(pro.id)}>+</div>
                    </div>

                    {/* THEME COLORS */}
                    <div>
                        <div className='text-center my-3'>Thème couleurs</div>
                        <div className='flex justify-around mt-3'>
                            {!pro.themeColor || pro.themeColor === "" ?
                                <Image src={boxbluelight} className='img-fluid' alt='boxbluelight' style={{ height:40, width:40 }} /> : 
                                <Image 
                                    src={boxbluelightoff} 
                                    className='img-fluid' 
                                    alt='boxbluelightoff' 
                                    style={{ height:40, width:40 }} 
                                    onClick={() => _handleColor(pro.id, "")}
                                />
                            }
                            {pro.themeColor === "blue" ?
                                <Image src={boxblue} className='img-fluid' alt='boxblue' style={{ height:40, width:40 }} /> : 
                                <Image 
                                    src={boxblueoff} 
                                    className='img-fluid' 
                                    alt='boxblueoff' 
                                    style={{ height:40, width:40 }} 
                                    onClick={() => _handleColor(pro.id, "blue")}
                                />
                            }
                            {pro.themeColor === "green" ?
                                <Image src={boxgreen} className='img-fluid' alt='boxgreen' style={{ height:40, width:40 }} /> : 
                                <Image 
                                    src={boxgreenoff} 
                                    className='img-fluid' 
                                    alt='boxgreenoff' 
                                    style={{ height:40, width:40 }} 
                                    onClick={() => _handleColor(pro.id, "green")}
                                />
                            }
                        </div>
                        <div className='flex justify-around mt-3'>
                            {pro.themeColor === "orange" ?
                                <Image src={boxorange} className='img-fluid' alt='boxorange' style={{ height:40, width:40 }} /> : 
                                <Image 
                                    src={boxorangeoff} 
                                    className='img-fluid' 
                                    alt='boxorangeoff' 
                                    style={{ height:40, width:40 }} 
                                    onClick={() => _handleColor(pro.id, "orange")}
                                />
                            }
                            {pro.themeColor === "pink" ?
                                <Image src={boxpink} className='img-fluid' alt='boxpink' style={{ height:40, width:40 }} /> : 
                                <Image 
                                    src={boxpinkoff} 
                                    className='img-fluid' 
                                    alt='boxpinkoff' 
                                    style={{ height:40, width:40 }} 
                                    onClick={() => _handleColor(pro.id, "pink")}
                                />
                            }
                            {pro.themeColor === "purple" ?
                                <Image src={boxpurple} className='img-fluid' alt='boxpurple' style={{ height:40, width:40 }} /> : 
                                <Image 
                                    src={boxpurpleoff} 
                                    className='img-fluid' 
                                    alt='boxpurpleoff' 
                                    style={{ height:40, width:40 }} 
                                    onClick={() => _handleColor(pro.id, "purple")}
                                />
                            }
                        </div>
                        <div className='flex justify-around mt-3'>
                            {pro.themeColor === "brown" ?
                                <Image src={boxbrown} className='img-fluid' alt='boxbrown' style={{ height:40, width:40 }} /> : 
                                <Image 
                                    src={boxbrownoff} 
                                    className='img-fluid' 
                                    alt='boxbrownoff' 
                                    style={{ height:40, width:40 }} 
                                    onClick={() => _handleColor(pro.id, "brown")}
                                />
                            }
                        </div>
                    </div>

                    {/*

                        <Image src={imageAdd} className='img-fluid' alt='image services' style={{ height:30, width:30 }} />
                    
                    */}

                

                </div>
            ))}

            <div style={{ height:400 }} />

        </div>
    )
}

export default ParamPro

/*

    blueLight: 99d6edff
    green 87deaaff
    blue 5f8dd3ff 
    pink ed9999ff
    orange edc399ff
    purple c399edff
    brown 84623fff

*/


