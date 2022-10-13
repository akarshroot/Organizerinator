import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './RegistrationBuilder.css'

function RegistrationBuilder() {
    const navigate = useNavigate()
    const { currentUser, getData, isOrg, generateEventForm } = useAuth()
    const [data, setData] = useState({})
    const [isLoading, toggleLoading] = useState(false)
    const [error, setError] = useState("")

    const [formOptions, setFormOptions] = useState(
        {
            name: false,
            universityId: false,
            tshirtSize: false,
            phnNum: false,
            email: false,
            year: false,
            department: false,
            teamName: false,
            teamSize: false,
            teamMembers: false,
            maxTeamSize: 0
        }
    )

    const [publishedLink, setPublishedLink] = useState("")

    async function getCurrentEventData() {
        try {
            const data = await getData()
            setData(data)
            console.log(data)
            // const countdown = new Date(data.currentEvent.eventStartDate) - new Date(Date.now())
            // console.log(msToTime(countdown))

        } catch (error) {
            setError(error)
        }
    }

    function handleFormOptions(e) {
        let name = e.target.id
        let value
        if (e.target.type == "checkbox")
            value = e.target.checked
        else value = e.target.value

        setFormOptions(lastValue => {
            return {
                ...lastValue,
                [name]: value
            }
        })
    }

    async function generateForm(e) {
        e.preventDefault()
        toggleLoading(true)
        try {
            // setFormOptions(lastValue => { return { ...lastValue, eventId: data.currentEvent._id } })
            const res = await generateEventForm(formOptions, data.currentEvent._id)
            setPublishedLink(res)
            toggleLoading(false)
        } catch (error) {
            console.log(error);
            setError(error)
            toggleLoading(false)
        }
    }

    useEffect(() => {
        getCurrentEventData()
    }, [currentUser, isOrg])

    return (
        <div className='page-container rb-container'>
            <h1>{data && data.currentEvent?.eventTitle}</h1>
            <div className="main-card-rb">
                <form onSubmit={generateForm}>
                    <p>Please select the columns you need in the registration form.</p>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.name} id='name' /><label htmlFor='name'>Name</label>
                    </div>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.universityId} id='universityId' /><label htmlFor='universityId'>University Id</label>
                    </div>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.tshirtSize} id='tshirtSize' /><label htmlFor='tshirtSize'>T-Shirt Size</label>
                    </div>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.phnNum} id='phnNum' /><label htmlFor='phnNum'>Phone Number</label>
                    </div>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.email} id='email' /><label htmlFor='email'>Email</label>
                    </div>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.year} id='year' /><label htmlFor='year'>Batch Start Year</label>
                    </div>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.department} id='department' /><label htmlFor='department'>Department</label>
                    </div>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.teamName} id='teamName' /><label htmlFor='teamName'>Team Name</label>
                    </div>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.teamSize} id='teamSize' /><label htmlFor='teamSize'>Team Size</label>
                    </div>
                    <div className='input-group'>
                        <input onChange={handleFormOptions} type='checkbox' checked={formOptions.teamMembers} id='teamMembers' /><label htmlFor='teamMembers'>Team Members Info</label>
                    </div>
                    {/* ----------------------------------------------------------------------------------------------- */}
                    <div className='input-group'>
                        <label htmlFor='maxTeamSize'>Max Team Size : </label>
                        <input onChange={handleFormOptions} value={formOptions.maxTeamSize} type='number' id='maxTeamSize' min="0" />
                    </div>
                    <input type="submit" value={isLoading ? "Loading..." : "Create From"} />
                </form>
                <p></p>
            </div>
        </div>
    )
}

export default RegistrationBuilder