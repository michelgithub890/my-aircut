import React, { useState } from 'react'
import { ref, set, onValue, push, remove, update, query, orderByChild, equalTo, get } from 'firebase/database'
import database from './base'

const useFirebase = () => {
    const [lists, setLists] = useState([])
    const [services, setServices] = useState([])
    const [profil, setProfil] = useState([])
    const [users, setUsers] = useState([])
    const [pushs, setPushs] = useState([])
    const [messagesChat, setMessagesChat] = useState([])
    const [daysOff, setDaysOff] = useState([])
    const [staffs, setStaffs] = useState([])
    const [hours, setHours] = useState([])
    const [books, setBooks] = useState([])
    const [tokens, setTokens] = useState([])

    // READ USERS 
    const _readTokens = (proId) => {
        setTokens([])
        const starCountRef = ref(database, `/pro/${proId}/tokens`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setTokens(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

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

    const _readBooks = (proId) => {
        setBooks([])
        const starCountRef = ref(database, `pro/${proId}/books`)
        try {
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                const dataList = []
                for (let id in data) {
                  dataList.push({id,...data[id]})
                }
                setBooks(dataList)
            })
        } catch {
            alert('il y a une erreur dans la lecture')
        }
    }

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
        _readBooks,
        books,
        _readTokens,
        tokens,
    }
}

export default useFirebase 

