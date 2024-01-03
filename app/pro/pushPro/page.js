'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'  
// REACT HOOK FORM 
import { useForm } from 'react-hook-form'
// MATERIAL UI 
import { TextField } from '@mui/material'
// NEXT LINK 
import Link from 'next/link'
// YUP 
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// DATE FNS 
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
// COMPONENTS
import HeaderPro from '@/components/pro/HeaderPro'
// IMAGES 
import { IoIosArrowDown } from "react-icons/io"
import { IoIosArrowUp } from "react-icons/io"

// Define your validation schema with Yup
const validationSchema = Yup.object({
    title: Yup.string()
                .required("Le titre est obligatoire.")
                .max(40, 'Le titre ne doit pas dépasser 40 caractères.'),
    message: Yup.string()
                 .required('Le message est obligatoire.')
                 .max(100, 'Le message ne doit pas dépasser 100 caractères.')
})

const PushPro = () => {
    const [showHistory, setShowHistory] = useState(false)
    const { _readPushs, pushs, _writeData } = useFirebase()
    const router = useRouter()
    // Initialise React Hook Form
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        _readPushs()
    },[])

    // Function to handle form submission
    const onSubmit = async (data) => {
        const { title, message } = data
        // date 
        const today = new Date()
        const formattedDate = format(today, 'eeee dd MMMM yyyy', { locale: fr })

        const requestBody = {
            title:title,
            message:message,
            // uidClient:user
        } 

        console.log('push ', requestBody)

        try {
            const response = await fetch(`https://node-server-solutionmobile.herokuapp.com/push`, {
            // const response = await fetch(`http://localhost:8000/pushMyresto`, {
                method: 'POST', // Changez GET en POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody) // Envoyez les données dans le corps de la requête
            })
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
    
            const responseData = await response.json()
            console.log('Réponse du serveur:', responseData)
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message push:', error)
        }

        const dataPush = {
            title:title,
            message:message,
            date:formattedDate
        }

        _writeData('pushs', dataPush)

        reset({ title: "", message: "" })
    }

    const _handleShowHistory = () => {
        setShowHistory(!showHistory)
    }

    return ( 
        <div>

            <HeaderPro title="Notification Push" />

            <div className="text-center text-2xl my-3 mt-3">Envoyer une notification</div>

            <div className='grid place-items-center'>

                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="flex flex-col gap-3 bg-white p-5 rounded-lg w-full md:w-3/4 lg:w-1/2 max-w-2xl"
                >
                    <TextField
                        label="Titre"
                        className="blackTextField"
                        {...register("title")}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        inputProps={{ maxLength: 40 }}
                    />
                    <TextField 
                        label="Message"
                        className="blackTextField"
                        {...register("message")}
                        error={!!errors.message}
                        helperText={errors.message?.message}
                        inputProps={{ maxLength: 100 }}
                    />

                    <button className="myButton" type="submit">Envoyer</button>

                </form>

            </div> 
        
            <div className="flex justify-center">
                <button className="myButton" onClick={_handleShowHistory}>Afficher historique</button>
            </div>

            {showHistory && 
                <div className="text-center">
                    {pushs?.sort((a, b) => b.date.localeCompare(a.date)).map(push => (
                        <div key={push.id} className="bg-slate-300 m-2 p-2">
                            <div>{push.title}</div>
                            <div>{push.message}</div>
                            <div>{push.date}</div>
                        </div>
                    ))}
                </div>
            }



            <div style={{ height:400 }} />

        </div>
    )
}

export default PushPro