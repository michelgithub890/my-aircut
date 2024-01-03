import React, { useState } from 'react'

const useForm = (initialState) => {
    const [values, setValues] = useState(initialState) 

    const _handleChange = event => { 
        // maintenir en memoire
        event.preventDefault()
        setValues(prevValues => ({ 
            ...prevValues,
            [event.target.name]: event.target.value 
        }))
    }

    // remettre a zero
    const _refresh = () => {
        setValues(initialState)
        // console.log('useForm refresh ',)
    }

    // CLEAR INPUT
    const _clearInput = (name) => {
        console.log('useForm clearInput ', name)
        setValues(prevValues => ({
            ...prevValues,
            [name]: ''
        }))
    }

    return { _handleChange, values, _refresh, setValues, _clearInput }
}

export default useForm


