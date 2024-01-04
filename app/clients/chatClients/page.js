'use client'
import React, { useEffect, useState } from 'react'
// MODELS 
import { MODEL_COLOR } from '@/models/ModelColor'
// MUI 
import Input from '@mui/material/Input'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import SendIcon from '@mui/icons-material/Send'
// HOOKS 
import useForm from '@/hooks/useForm'
// DATE 
import { format } from 'date-fns'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
// NEXT 
import Link from 'next/link'
// IMAGES  
import { IoIosArrowRoundBack } from "react-icons/io"

const INITIAL_STATE = {
    message: "",
} 

const ChatClients = () => {
    const { _handleChange, values, _refresh } = useForm(INITIAL_STATE)
    const { _writeData, _readMessagesChat, messagesChat, _deleteData, _readUsers, users, _updateData } = useFirebase()
    const [openDialog, setOpenDialog] = useState(false)
    const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'))
    const [proId, setProId] = useState(localStorage.getItem('proId'))
    const [messageToDelete, setMessageToDelete] = useState(null)

    useEffect(() => {
        _readMessagesChat()
        _readUsers()
    },[])

    useEffect(() => {
        _readUsers(proId)
    },[proId])

    const _updateMessage = (id) => {
        const data = {
            read:true
        }
        _updateData(`chat/${id}`, data)
    }

    const _handleSend = (user) => {
        const currentDate = new Date()
        const formattedDate = format(currentDate, "dd/MM/yyyy")
        const dateInt = currentDate.getTime()
        const data = {
            userId:user.id,
            userName:user.name,
            userEmail:user.email,
            destinataire:"pro",
            // destinataire:"client",
            date:formattedDate,
            dateInt:dateInt,
            message:values.message,
        }
        _writeData(`chat`, data)
        _refresh()
    }

    const _handleDelete = (id) => { 
        console.log('chat _handleDelete')
        setMessageToDelete(id)
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setMessageToDelete(null);
    }
    
    const confirmDelete = () => {
        if (messageToDelete) {
            _deleteData(`chat/${messageToDelete}`)
        }
        handleCloseDialog();
    }

    const handleLongPress = (message, user) => {
        // Si le message n'est pas de l'utilisateur, retourner un objet vide (aucun événement attaché)
        if (message.userId !== user.id) {
            return {};
        }
    
        let timerId;
    
        // Fonction pour démarrer le timer lors de l'appui
        const startPress = () => {
            timerId = setTimeout(() => {
                _handleDelete(message.id);
            }, 1000); // 1000ms = 1s
        };
    
        // Réinitialiser le timer lors du relâchement ou de la sortie de l'appui
        const clearPress = () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        }
    
        return {
            onMouseDown: startPress,
            onMouseUp: clearPress,
            onMouseLeave: clearPress,
            onTouchStart: startPress,
            onTouchEnd: clearPress,
            onTouchCancel: clearPress
        }
    }

    return (
        <div className='wrap-text'>
            
            <div className="flex justify-start items-center gap-3 p-3 border-b-2">
                <Link href={"/clients/homeClients"}>
                    <IoIosArrowRoundBack size={"2.2rem"} />
                </Link> 
                <div>Retour</div>
            </div>

            {users?.filter(user => user.email === isAuth).map(user => 
                <div key={user.id}>
                    <Input 
                        name='message'
                        onChange={_handleChange}
                        value={values.message}
                        placeholder="Message..."
                        multiline
                        endAdornment={
                            <InputAdornment position="end">
                                <SendIcon 
                                    onClick={values.message.trim().length > 0 ? () => _handleSend(user) : null} 
                                    style={{ color:MODEL_COLOR.blueApply, cursor: values.message.trim().length > 0 ? 'pointer' : 'not-allowed' }}
                                />
                            </InputAdornment>
                        }
                        style={{
                            paddingLeft: 20, 
                            paddingRight: 20, 
                            paddingTop:20,
                            paddingBottom:20,
                            width:"100%",
                            whiteSpace: 'pre-wrap'
                        }}
                        inputProps={{ maxLength: 2000 }}
                    />

                    <div style={{ height:20 }} />
 
                    <div 
                        style={{ 
                            maxHeight:"100vh", 
                            overflowY: "auto",
                            scrollbarWidth: "none", /* pour Firefox */
                            msOverflowStyle: "none", /* pour IE 11 */
                            "&::WebkitScrollbar": { 
                                display: "none" /* pour Chrome, Safari et d'autres navigateurs basés sur WebKit */
                            },
                            paddingBottom:"200px"
                        }}
                    >
                        {messagesChat?.filter(message => message.userId === user.id).reverse().map((message, i) => {
                            if (i < 100) {
                                // Vérifiez si le message n'a pas été lu et mettez à jour le statut
                                if (!message.read && message.destinataire === "client") {
                                    _updateMessage(message.id)
                                }

                                return (
                                <div 
                                    key={message.id} 
                                    {...handleLongPress(message, user)}
                                    style={message.destinataire === "pro" ? 
                                    {
                                        backgroundColor:"lightgrey",
                                        margin:"10px",
                                        padding:"10px",
                                        borderRadius:15,
                                        marginLeft:"25%"
                                    } 
                                    : 
                                    {
                                        backgroundColor:"lightblue",
                                        margin:"10px",
                                        padding:"10px",
                                        borderRadius:15,
                                        marginRight:"25%"
                                    }
                                    }
                                >
                                    <div style={{ textAlign:"center", fontSize:12 }}>{message.date}</div>
                                    <div style={{ paddingBottom:"5px"}}>{message.message}</div>
                                </div>
                                )
                            }
                        })}

                    </div>


                </div>)
            }

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr de vouloir supprimer ce message?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default ChatClients
