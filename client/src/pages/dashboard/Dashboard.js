import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
    const { currentUser, logout, loginStatus, getData, isOrg } = useAuth()
    const navigate = useNavigate()
    const [data, setData] = useState({})
    const [error, setError] = useState("")

    // const [deskMode, toggleDeskMode] = useState(false)
    // const [time, setTime] = useState({})

    // function msToTime(ms) {
    //     let seconds = (ms / 1000).toFixed(1);
    //     let minutes = (ms / (1000 * 60)).toFixed(1);
    //     let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    //     let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    //     if (seconds < 60) return "00 Days : 00 Hrs : 00 Min " + seconds + " Sec";
    //     else if (minutes < 60) return "00 Days : 00 Hours " + minutes + " Min" + seconds + " Seconds";
    //     else if (hours < 24) return "00 Days : " + hours + " Hrs " + minutes + " Minutes : " + seconds + " Seconds";
    //     else return days + " Days : " + hours + " Hrs : " + minutes + " Minutes : " + seconds + " Seconds"
    // }

    async function getDashboardData() {
        try {
            const data = await getData()
            setData(data)
            // const countdown = new Date(data.currentEvent.eventStartDate) - new Date(Date.now())
            // console.log(msToTime(countdown))

        } catch (error) {
            setError(error)
        }
    }

    useEffect(() => {
        getDashboardData()
    }, [currentUser, isOrg])


    return (
        <div className='page-container dashboard-container'>
            <h1>DASHBOARD</h1>
            <div className="main-card-dashboard">
                <h2>Current Event</h2>
                {data &&
                    <div className="event-details">
                        <div className="event-detail-s1">
                            <div className="event-title">{data.currentEvent?.eventTitle}</div>
                            <div className="event-description">{data.currentEvent?.eventDescription}</div>
                            {/* <div className="countdown-container">{ }</div> */}
                            <div className="total-registrations">Total Registrations: {data.currentEvent?.totalRegistrations}</div>
                            <div className="attending">Attending: {data.currentEvent?.attending}</div>
                            {!data.currentEvent?.registrationPath &&
                                <button className='dashboard-btn button-48' onClick={() => navigate("/registration/build")}>
                                    <span>
                                        Generate Registration Form
                                    </span>
                                </button>
                            }
                            {data.currentEvent?.registrationPath &&
                                <button className='dashboard-btn button-48' onClick={() => navigate(`/event/form/${data.currentEvent?.registrationPath}`)}>
                                    <span>
                                        View Registration Form
                                    </span>
                                </button>
                            }
                        </div>
                        <div className="event-detail-s2">
                            <div className="attendance-details">
                                <button className='dashboard-btn button-48' onClick={() => navigate("/attendance/" + data.currentEvent._id)}>
                                    <span>Attendance</span>
                                </button>
                            </div>
                            <div className="evaluation">
                                <button className='dashboard-btn button-48'>
                                    <span>Evaluation</span>
                                </button>
                            </div>
                            <div className="teams">
                                <button className='dashboard-btn button-48'>
                                    <span>Teams Layout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="main-card-dashboard">
                <button className='dashboard-btn button-48'>
                    <span className="org-actions">
                        <Link className='link-b' to="/create/event">Create Event</Link>
                    </span>
                </button>
            </div>
        </div>
    )
}

export default Dashboard