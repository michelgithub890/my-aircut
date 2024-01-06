import React, { useState } from 'react'
import { ref, set, onValue, push, remove, update, query, orderByChild, equalTo, get } from 'firebase/database'
import database from './base'

const useFirebase = () => {
    const [lists, setLists] = useState([])
    const [services, setServices] = useState([])
    const [profil, setProfil] = useState([])
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [pushs, setPushs] = useState([])
    const [messagesChat, setMessagesChat] = useState([])
    const [daysOff, setDaysOff] = useState([])
    const [staffs, setStaffs] = useState([])
    const [hours, setHours] = useState([])

    // READ USERS 
    // const _readUsers = () => {
    //     setUsers([])
    //     const starCountRef = ref(database, 'users')
    //     try {
    //         onValue(starCountRef, (snapshot) => {
    //             const data = snapshot.val()
    //             const dataList = []
    //             for (let id in data) {
    //               dataList.push({id,...data[id]})
    //             }
    //             setUsers(dataList)
    //         })
    //     } catch {
    //         alert('il y a une erreur dans la lecture')
    //     }
    // }
 
    // // READ GROUP 
    // const _readLists = () => {
    //     setLists([])
    //     const starCountRef = ref(database, 'services/list')
    //     try {
    //         onValue(starCountRef, (snapshot) => {
    //             const data = snapshot.val()
    //             const dataList = []
    //             for (let id in data) {
    //               dataList.push({id,...data[id]})
    //             }
    //             setLists(dataList)
    //         })
    //     } catch {
    //         alert('il y a une erreur dans la lecture')
    //     }
    // }

    // const _readStaffs = () => {
    //     setStaffs([])
    //     const starCountRef = ref(database, 'staff')
    //     try {
    //         onValue(starCountRef, (snapshot) => {
    //             const data = snapshot.val()
    //             const dataList = []
    //             for (let id in data) {
    //               dataList.push({id,...data[id]})
    //             }
    //             setStaffs(dataList)
    //         })
    //     } catch {
    //         alert('il y a une erreur dans la lecture')
    //     }
    // }

    // const _readHours = () => {
    //     setHours([])
    //     const starCountRef = ref(database, 'hours')
    //     try {
    //         onValue(starCountRef, (snapshot) => {
    //             const data = snapshot.val()
    //             const dataList = []
    //             for (let id in data) {
    //               dataList.push({id,...data[id]})
    //             }
    //             setHours(dataList)
    //         })
    //     } catch {
    //         alert('il y a une erreur dans la lecture')
    //     }
    // }
    
    // // READ SERVICES   
    // const _readServices = () => {
    //     setServices([])
    //     const starCountRef = ref(database, 'services/items')
    //     try {
    //         onValue(starCountRef, (snapshot) => {
    //             const data = snapshot.val()
    //             const dataList = []
    //             for (let id in data) {
    //               dataList.push({id,...data[id]})
    //             }
    //             setServices(dataList)
    //         })
    //     } catch {
    //         alert('il y a une erreur dans la lecture')
    //     }
    // }

    // READ DAYS OFF 
    // const _readDaysOff = () => {
    //     setDaysOff([])
    //     const starCountRef = ref(database, 'daysOff')
    //     try {
    //         onValue(starCountRef, (snapshot) => {
    //             const data = snapshot.val()
    //             const dataList = []
    //             for (let id in data) {
    //               dataList.push({id,...data[id]})
    //             }
    //             setDaysOff(dataList)
    //         })
    //     } catch {
    //         alert('il y a une erreur dans la lecture')
    //     }
    // }

    // READ CHAT   
    // const _readMessagesChat = () => {
    //     setMessagesChat([])
    //     const starCountRef = ref(database, 'chat')
    //     try {
    //         onValue(starCountRef, (snapshot) => {
    //             const data = snapshot.val()
    //             const dataList = []
    //             for (let id in data) {
    //               dataList.push({id,...data[id]})
    //             }
    //             setMessagesChat(dataList)
    //         })
    //     } catch {
    //         alert('il y a une erreur dans la lecture')
    //     }
    // }

    // READ ORDERS  
    const _readOrders = () => {
        setOrders([])
        const starCountRef = ref(database, 'orders')
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setOrders(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // READ DELIVERIES  
    const _readDeliveries = () => {
        setDeliveries([])
        const starCountRef = ref(database, 'delivery')
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setDeliveries(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // READ PUSHS   
    // const _readPushs = () => {
    //     setPushs([])
    //     const starCountRef = ref(database, 'pushs')
    //     try {
    //         onValue(starCountRef, (snapshot) => {
    //             const data = snapshot.val()
    //             const dataList = []
    //             for (let id in data) {
    //               dataList.push({id,...data[id]})
    //             }
    //             setPushs(dataList)
    //         })
    //     } catch {
    //         alert('il y a une erreur dans la lecture')
    //     }
    // }

    // // READ PROFIL 
    // const _readProfil = () => {
    //     setProfil([])
    //     const starCountRef = ref(database, 'profil')
    //     try {
    //         onValue(starCountRef, (snapshot) => {
    //             const data = snapshot.val()
    //             const dataList = []
    //             for (let id in data) {
    //               dataList.push({id,...data[id]})
    //             }
    //             setProfil(dataList)
    //         })
    //     } catch {
    //         alert('il y a une erreur dans la lecture')
    //     }
    // }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // READ USERS 
    const _readUsers = (proId) => {
        setUsers([])
        const starCountRef = ref(database, `/pro/${proId}/users`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setUsers(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // READ PROFIL 
    const _readProfil = (proId) => {
        setProfil([])
        const starCountRef = ref(database, `pro/${proId}/profil`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setProfil(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    const _readMessagesChat = (proId) => {
        setMessagesChat([])
        const starCountRef = ref(database, `pro/${proId}/chat`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setMessagesChat(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    const _readDaysOff = (proId) => {
        setDaysOff([])
        const starCountRef = ref(database, `pro/${proId}/daysOff`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setDaysOff(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // READ GROUP 
    const _readLists = (proId) => {
        setLists([])
        const starCountRef = ref(database, `pro/${proId}/services/list`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setLists(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    // READ SERVICES   
    const _readServices = (proId) => {
        setServices([])
        const starCountRef = ref(database, `pro/${proId}/services/items`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setServices(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    const _readStaffs = (proId) => {
        setStaffs([])
        const starCountRef = ref(database, `pro/${proId}/staff`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setStaffs(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    const _readHours = (proId) => {
        setHours([])
        const starCountRef = ref(database, `pro/${proId}/hours`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setHours(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    const _readPushs = (proId) => {
        setPushs([])
        const starCountRef = ref(database, `pro/${proId}/pushs`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setPushs(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // WRITE DATA 
    const _writeData = (id,data) => {
        try {
            const postListRef = ref(database, '/'+id)
            const newPostRef = push(postListRef)
            set(newPostRef, data)
        } catch {
            console.log('Il y a une erreur dans l ecriture')
        }
    } 

    // DELETE DATA 
    const _deleteData = (id) => {
        // console.log('userFirebase _deleteData ', id)
        const todoRef = ref(database, '/' + id)
        remove(todoRef)  
    }

    // UPDATE DATA 
    const _updateData = (id,data) => {
        // console.log('userFirebase updateData ') 
        const todoRef = ref(database, '/' + id)
        update(todoRef, data)
    }

    // CONST TO UPPERCASE FIRST LETTER
    const _toUpperCaseLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    return { 
        _toUpperCaseLetter,
        _deleteData,  
        _writeData,
        _updateData,
        _readLists,
        lists,
        _readServices,
        services,
        _readProfil,
        profil,
        _readUsers,
        users,
        _readOrders,
        orders,
        _readDeliveries,
        deliveries,
        _readPushs,
        pushs,
        _readMessagesChat, 
        messagesChat,
        _readDaysOff, 
        daysOff,
        _readStaffs, 
        staffs,
        _readHours,
        hours,
        //////////////////////
    }
}

export default useFirebase 

