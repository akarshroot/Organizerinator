import React, { useEffect, useRef, useState } from 'react'
import Tabs, { Tab } from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';

import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './RegistrationForm.css'

function RegistrationForm() {
    const params = useParams()
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        teamSize: 2,
    })
    const [eventInfo, setEventInfo] = useState({})
    const [loading, toggleLoading] = useState(false)

    const [activeTab, setActiveTab] = useState(1)
    const memberTabRef = useRef()
    // const [totalTabs, setTotalTabs] = useState(1)
    const navigate = useNavigate()

    const { getEventFormInfo, registerParticipant } = useAuth()

    function handleFormOptions(e) {
        let name = e.target.id
        let value = e.target.value
        if (e.target.getAttribute('data-member')) {
            const memberId = e.target.getAttribute('data-memberid')
            const objName = `member${memberId}`
            let copyMember = { ...formData[`member${memberId}`] }
            copyMember[`${name}`] = value
            setFormData(lastValue => {
                return {
                    ...lastValue,
                    [objName]: copyMember
                }
            })
        }
        else {
            setFormData(lastValue => {
                return {
                    ...lastValue,
                    [name]: value
                }
            })
        }
    }

    async function handleRegistration(e) {
        e.preventDefault()
        toggleLoading(true)
        try {
            const res = await registerParticipant(formData)
        } catch (error) {

        }
        toggleLoading(false)
    }

    async function fetchEventInfo() {
        toggleLoading(true)
        const formId = params.formId
        setFormData(lastValue => {
            return {
                ...lastValue,
                formId: formId
            }
        })
        try {
            const res = await getEventFormInfo(formId)
            setEventInfo(res)
        } catch (error) {
            setError(error)
        }
        toggleLoading(false)
    }

    useEffect(() => {
        fetchEventInfo()
        return () => {
            setError("")
            toggleLoading(false)
        }
    }, [])

    return (
        <div className='page-container rf-container'>
            <h1>Registration Form</h1>
            <div className="main-card-rf">
                <h2>{eventInfo && eventInfo.eventTitle}</h2>
                <p>{eventInfo && eventInfo.eventDescription}</p>
                <p>{eventInfo && eventInfo.eventStartDate}</p>
                <p>{eventInfo && eventInfo.eventStartDate}</p>
                <p>{eventInfo && eventInfo.eventDuration}</p>
                <form onSubmit={handleRegistration}>
                    <Tabs activeTab={activeTab}
                        className=""
                        ulClassName=""
                        activityClassName="bg-success"
                        onClick={(event, tab) => { }}
                    >
                        <Tab title="General" className="mr-3">
                            <div className="mt-3">
                                <div style={{ display: "flex", flexWrap: "wrap" }}>
                                    <div className="tab-col">
                                        <h3>Leader Details</h3>
                                        <div className='input-group'>
                                            <label htmlFor='name'>Name: </label><input onChange={handleFormOptions} type='text' value={formData.name} id='name' required={true} />
                                        </div>
                                        <div className='input-group'>
                                            <label htmlFor='universityId'>University Id: </label><input onChange={handleFormOptions} type='number' value={formData.universityId} id='universityId' required={true} />
                                        </div>
                                        <div className='input-group'>
                                            <label htmlFor='tshirtSize'>T-Shirt Size: </label><input onChange={handleFormOptions} type='select' value={formData.tshirtSize} id='tshirtSize' required={true} />
                                        </div>
                                        <div className='input-group'>
                                            <label htmlFor='phnNum'>Phone Number: </label><input onChange={handleFormOptions} type='number' value={formData.phnNum} id='phnNum' required={true} />
                                        </div>
                                        <div className='input-group'>
                                            <label htmlFor='email'>Email: </label><input onChange={handleFormOptions} type='email' value={formData.email} id='email' required={true} />
                                        </div>
                                        <div className='input-group'>
                                            <label htmlFor='batch'>Batch Start Year: </label><input onChange={handleFormOptions} type='select' value={formData.year} id='batch' required={true} />
                                        </div>
                                        <div className='input-group'>
                                            <label htmlFor='department'>Department: </label><input onChange={handleFormOptions} type='select' value={formData.department} id='department' required={true} />
                                        </div>
                                    </div>
                                    <div className="tab-col">
                                        <h3>Team Details</h3>
                                        <div className='input-group'>
                                            <label htmlFor='teamName'>Team Name: </label><input onChange={handleFormOptions} type='text' value={formData.teamName} id='teamName' required={true} />
                                        </div>
                                        <div className='input-group'>
                                            <label htmlFor='teamSize'>Team Size: </label><input onChange={handleFormOptions} type='number' value={formData.teamSize} min="1" id='teamSize' />
                                        </div>
                                        <span className='input-help-text'> &#x1F6C8; Including leader</span>
                                        <div className="tab-actions">
                                            <button type='button' onClick={() => document.getElementsByClassName("mr-3")[1].click()}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        {/* -------------------------------------------------------------------------------------------------------------------------------- */}
                        <Tab title="Members" className="mr-3">
                            <div className="main-members-container">
                                {
                                    (formData.teamSize - 1) > 0
                                        ? [...Array(formData.teamSize - 1)].map((data, idx) => {
                                            return (
                                                <div className="mt-3" key={idx}>
                                                    <h3>Member {idx + 1}</h3>
                                                    <div className='input-group'>
                                                        <label htmlFor='name'>Name: </label><input onChange={handleFormOptions} type='text' value={formData[`member${idx + 1}`]?.name} data-member={true} data-memberid={idx + 1} id='name' required={true} />
                                                    </div>
                                                    <div className='input-group'>
                                                        <label htmlFor='universityId'>University Id: </label><input onChange={handleFormOptions} type='number' value={formData[`member${idx + 1}`]?.universityId} data-member={true} data-memberid={idx + 1} id='universityId' required={true} />
                                                    </div>
                                                    <div className='input-group'>
                                                        <label htmlFor='tshirtSize'>T-Shirt Size: </label><input onChange={handleFormOptions} type='select' value={formData[`member${idx + 1}`]?.tshirtSize} data-member={true} data-memberid={idx + 1} id='tshirtSize' required={true} />
                                                    </div>
                                                    <div className='input-group'>
                                                        <label htmlFor='phnNum'>Phone Number: </label><input onChange={handleFormOptions} type='number' value={formData[`member${idx + 1}`]?.phnNum} data-member={true} data-memberid={idx + 1} id='phnNum' required={true} />
                                                    </div>
                                                    <div className='input-group'>
                                                        <label htmlFor='email'>Email: </label><input onChange={handleFormOptions} type='email' value={formData[`member${idx + 1}`]?.email} data-member={true} data-memberid={idx + 1} id='email' required={true} />
                                                    </div>
                                                    <div className='input-group'>
                                                        <label htmlFor='batch'>Batch Start Year: </label><input onChange={handleFormOptions} type='select' value={formData[`member${idx + 1}`]?.year} data-member={true} data-memberid={idx + 1} id='batch' required={true} />
                                                    </div>
                                                    <div className='input-group'>
                                                        <label htmlFor='department'>Department: </label><input onChange={handleFormOptions} type='select' value={formData[`member${idx + 1}`]?.department} data-member={true} data-memberid={idx + 1} id='department' required={true} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <></>
                                }
                            </div>
                            <div className="tab-actions">
                                <button type='button' onClick={() => document.getElementsByClassName("mr-3")[0].click()}>Previous</button>
                                <button type='submit'>{loading ? "Loading..." : "Submit"}</button>
                            </div>
                        </Tab>
                    </Tabs>
                </form>
            </div>
        </div>
    )
}

export default RegistrationForm


