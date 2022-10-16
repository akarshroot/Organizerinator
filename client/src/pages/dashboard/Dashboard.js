import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
    const { currentUser, logout, fetchParticipant, getData, isOrg, markPresent } = useAuth()
    const navigate = useNavigate()
    const [data, setData] = useState({})
    const [participantData, setParticipantData] = useState({})
    const [participantTable, setParticipantTable] = useState(-1)

    const [error, setError] = useState("")
    const [deskMode, toggleDeskMode] = useState(false)
    const teamNumberRef = useRef()
    const [tableAllotmentSuccess, setTableAllotmentSuccess] = useState(false)

    const [searching, setSearching] = useState(false)
    const [attendingLoader, setAttendingLoader] = useState(false)

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
        } catch (error) {
            setError(error)
        }
    }

    async function searchParticipant() {
        cleanupPrevParticipant()
        setSearching(true)
        try {
            const eventId = data.currentEvent._id
            const teamNumber = teamNumberRef.current.value
            if(teamNumber < 1 || teamNumber == undefined) return setSearching(false)
            const participantData = await fetchParticipant(teamNumber, eventId)
            setParticipantData(participantData)
            setSearching(false)
        } catch (error) {
            setError(error)
            setSearching(false)
        }
    }

    async function setParticipantAttending() {
        setAttendingLoader(true)
        try {
            const teamId = participantData._id
            const tableData = await markPresent(teamId)
            setParticipantTable(tableData)
            setAttendingLoader(false)
            setTableAllotmentSuccess(true)
        } catch (error) {
            setError(error)
            setAttendingLoader(false)
        }
    }

    function cleanupPrevParticipant() {
        setTableAllotmentSuccess(false)
        setParticipantTable(false)
        setParticipantData({})
        setError("")
    }

    useEffect(() => {
        getDashboardData()
    }, [currentUser, isOrg])


    return (
        <div className='page-container dashboard-container'>
            <h1>DASHBOARD</h1>
            {!deskMode &&
                <>
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
                                    <button className='dashboard-btn button-48' onClick={() => {toggleDeskMode(!deskMode); setError("")}}>
                                        <span>
                                            {deskMode ? "Disable Desk Mode" : "Enable Desk Mode"}
                                        </span>
                                    </button>
                                </div>
                                <div className="event-detail-s2">
                                    <div className="attendance-details">
                                        <button className='dashboard-btn button-48' onClick={() => navigate("/sheet/generate/" + data.currentEvent._id)}>
                                            <span>Sheet Generator</span>
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

                    <div className="org-actions">
                        <button className='dashboard-btn button-48' onClick={() => navigate("/create/event")}>
                            <span className="org-actions">
                                Create New Event
                            </span>
                        </button>
                    </div>
                </>
            }
            {deskMode &&
                <div className="main-card-dashboard">
                    <div className="desk-container">
                        <div className="desk-team-info">
                            <h2>Desk Mode</h2>
                            <div className="input-group-desk">
                                <input type="number" placeholder='Enter team number' ref={teamNumberRef} min={1}/>
                                <p>Scan participant's QR code and enter team number.</p>
                                <button className='dashboard-btn button-48' onClick={searchParticipant}>
                                    <span>{searching ? "Searching..." : "Search"}</span>
                                </button>
                            </div>
                        </div>
                        {participantData._id &&
                            <div className="participant-data">
                                <div className="participant-info">
                                    <div className="team-number-name"><h2>#{participantData.teamNumber}&nbsp;{participantData.teamName}</h2></div>
                                    <div className="team-details">
                                        {
                                            participantData.teamMembers?.map(member => {
                                                return (
                                                    <div className="member-data" key={member._id}>
                                                        <img src={`https://hp.chitkara.edu.in//Storage/Images/Student/${member.universityId}.jpg`} alt="" />
                                                        <span>{member.name}</span>
                                                        <span>{member.universityId}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="desk-actions">
                                    <button className='dashboard-btn button-48' style={{ padding: "10px" }} onClick={setParticipantAttending}>
                                        <span>
                                            {attendingLoader ? "Marking Present..." : "Mark Present"}
                                        </span>
                                    </button>
                                    {tableAllotmentSuccess &&
                                        <div className="allotted-table-message">
                                            <h3>Table #{participantTable.allottedTable} allotted!</h3>
                                        </div>
                                    }
                                    {error &&
                                        <div className="allotted-table-message">
                                            <p>{error}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    <hr className="style-two" />
                    <button className='dashboard-btn button-48' style={{ padding: "10px" }} onClick={() => { toggleDeskMode(!deskMode); getDashboardData(); cleanupPrevParticipant() }}>
                        <span>
                            {deskMode ? "Disable Desk Mode" : "Enable Desk Mode"}
                        </span>
                    </button>
                </div>
            }
        </div>
    )
}

export default Dashboard