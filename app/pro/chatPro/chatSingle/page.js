'use client'
import React, { useEffect, useState } from 'react'
// HOOKS 
import useForm from '@/hooks/useForm'
// MODELS 
import { MODEL_COLOR } from '@/models/ModelColor'
// MATERIAL UI 
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Input from '@mui/material/Input'
import SendIcon from '@mui/icons-material/Send'
// DATE FNS 
import { format } from 'date-fns'
// FIREBASE 
import useFirebase from '@/firebase/useFirebase'
import HeaderCustom from '@/components/pro/HeaderCustom'


const INITIAL_STATE = {
    message: "",
}

const ChatSingle = () => {
    const { _handleChange, values, _refresh, setValues } = useForm(INITIAL_STATE) 
    const { messagesChat, _updateData, _writeData, _deleteData, _readMessagesChat, _readUsers, users } = useFirebase()
    const [openDialog, setOpenDialog] = useState(false)
    const [messageToDelete, setMessageToDelete] = useState(null)
    const [urlStored, setUrlStored] = useState("")
    const [emetteur, setEmetteur] = useState()
    const [proId, setProId] = useState()
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const emetteurData = localStorage.getItem("emetteur")
            const parsedEmetteurData = emetteurData ? JSON.parse(emetteurData) : null
            setEmetteur(parsedEmetteurData)
            setUrlStored(localStorage.getItem('url')) 
            const proIdStored = localStorage.getItem('proId')
            if (proIdStored) setProId(proIdStored)
            setCount(count + 1)
        }
    },[])

    useEffect(() => {
        _readMessagesChat(proId)
        _readUsers(proId)
    },[count])

    useEffect(() => {
        window.scrollTo(0,0)
    },[messagesChat])

    const _updateMessage = (id) => {
        console.log('ChatSingle _updateMessage', id)
        const data = {
            read:true
        }
        _updateData(`pro/${proId}/chat/${id}`, data)
    }

    const _handleSend = (user) => {
        const currentDate = new Date()
        const formattedDate = format(currentDate, "dd/MM/yyyy")
        const dateInt = currentDate.getTime()
        const data = {
            userId:user.id,
            userName:user.name,
            userEmail:user.email,
            // destinataire:"pro",
            destinataire:"client",
            date:formattedDate,
            dateInt:dateInt,
            message:values.message,
        }
        _writeData(`pro/${proId}/chat`, data)
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

    const handleLongPress = (message) => {

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
        <div>

            <HeaderCustom title="Retour" url={urlStored} />

            {users?.filter(user => user.id === emetteur.userId).map(user => 
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
                        {messagesChat?.filter(message => message.userId === emetteur.userId).reverse().map((message, i) => {
                            if (i < 100) {
                                // Vérifiez si le message n'a pas été lu et mettez à jour le statut
                                if (!message.read && message.destinataire === "pro") {
                                    _updateMessage(message.id)
                                }

                                return (
                                <div 
                                    key={message.id} 
                                    {...handleLongPress(message, user)}
                                    style={message.destinataire === "client" ? 
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

            <div style={{ height:400 }} />

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {"Êtes-vous sûr de vouloir supprimer ce message?"}
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

export default ChatSingle

