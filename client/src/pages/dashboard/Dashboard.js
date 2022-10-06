import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
    const { currentUser, logout, loginStatus, getData, isOrg } = useAuth()
    const navigate = useNavigate()
    const [data, setData] = useState({})
    const [error, setError] = useState("")

    async function getDashboardData() {
        try {
            const data = await getData()
            setData(data)
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
            <div className="main-card">
                <h2>Current Event</h2>
                {data && data.eventHistory.length != 0 && data.eventHistory[data.eventHistory.length - 1] &&
                    <div className="event-details">
                        <div className="event-detail-s1">
                            <div className="event-title"></div>
                            <div className="countdown-container"></div>
                            <div className="total-registrations"></div>
                            <div className="attending"></div>
                        </div>
                        <div className="event-detail-s2">
                            <div className="attendance-details"></div>
                            <div className="evaluation"></div>
                            <div className="teams"></div>
                        </div>
                    </div>
                }
            </div>
            <div className="org-actions">
                <Link to="/create/event">Create Event</Link>
            </div>
        </div>
    )
}

export default Dashboard