import React, { useState } from 'react'
import './CreateEvent.css'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

function CreateEvent() {
    const { currentUser, createEvent } = useAuth()
    const [eventInputData, setEventInputData] = useState()
    const [isLoading, toggleLoading] = useState()
    const [error, setError] = useState("")

    function handleEventInputData(e) {
        let name = e.target.name
        let value = e.target.value
        setEventInputData(lastValue => {
            return {
                ...lastValue,
                [name] : value
            }
        })
    } 

    async function handleSubmit(e) {
        e.preventDefault()
        toggleLoading(true)
        try {
            const res = await createEvent(eventInputData)
            if(res.error) throw res
            else Navigate("/dashboard")
        } catch (error) {
            setError(error.message)
        }
        toggleLoading(false)
    }

    return (
        <div className='page-container create-event-container'>
            <h1>Create New Event</h1>
            <div className="main-card-ce">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input onChange={handleEventInputData} name="eventTitle" placeholder='Title'/>
                    </div>
                    <div className="input-group">
                        <textarea onChange={handleEventInputData} name="eventDescription" placeholder='Description' />
                    </div>
                    <div className="input-group">
                        <input onChange={handleEventInputData} name="eventStartDate" type='datetime-local' />
                    </div>
                    <div className="input-group">
                        <input onChange={handleEventInputData} name="eventDuration" type='number' placeholder='Duration in hours' />
                    </div>
                    <div className="input-group">
                        <input type="submit" value={isLoading ? "Loading..." : "Create Event"} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateEvent