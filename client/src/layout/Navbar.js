import React, { useEffect, useState } from 'react'
import './Navbar.css'
import hamburger from '../assets/icons/hamburger-menu.svg'
import hamburgerDark from '../assets/icons/hamburger-menu-dark.svg'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'

function Navbar() {

    const [navState, setNavState] = useState(false)
    const [screenWidth, setScreenWidth] = useState(getWindowSize())
    const [dropdown, toggleDropdown] = useState(false)
    const [loading, setLoading] = useState(false)

    const [mobileMenuState, toggleMobileMenuState] = useState(false)

    const navigate = useNavigate()
    const { currentUser, userData, logout } = useAuth()

    function openMobileMenu() {
        toggleMobileMenuState(true)
    }

    function closeMobileMenu() {
        toggleMobileMenuState(false)
    }

    function getWindowSize() {
        const { innerWidth } = window
        return innerWidth
    }

    useEffect(() => {
        function handleWindowResize() {
            setScreenWidth(getWindowSize())
        }
        window.addEventListener('resize', handleWindowResize)
        return () => {
            window.removeEventListener('resize', handleWindowResize)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        document.addEventListener("scroll", () => {
            let scrollPosition = window.pageYOffset || window.scrollY || document.body.scrollTop || document.documentElement.scrollTop;
            if (scrollPosition > 0) {
                setNavState(true)
            } else {
                setNavState(false)
            }
        })
        // if (userData) {
        if (currentUser) {
            setLoading(false)
        }
    }, [currentUser, userData])


    return (
        <div className='nav-container' style={navState ? { backgroundColor: "var(--c3)", color: "var(--c1)" } : { backgroundColor: "var(--c1)", color: "var(--c3)" }}>
            <div className="nav-icon-container">
                <img src={navState ? hamburger : hamburgerDark} alt="" id="hamburger" onClick={openMobileMenu} />
            </div>
            <div className="nav-title">
                <h1 onClick={() => { navigate("/") }}>Organizerinator</h1>
            </div>
            <ul className={screenWidth > 665 ? "nav-tabs-container" : "nav-tabs-container-mobile"} style={screenWidth > 665 ? { marginLeft: "0px" } : (mobileMenuState ? { marginLeft: "0vw" } : { marginLeft: "-200vw" })}>
                <li id="close-mobile-menu" onClick={closeMobileMenu}>X</li>
                <li className={navState ? "nav-tab nav-tab-hover" : "nav-tab nav-tab-hover-dark"} onClick={() => { navigate("/") }}>Home</li>
                {currentUser ? loading ? <>Loading...</> : <li className={navState ? "nav-tab-btn nav-tab-btn-hover" : "nav-tab-btn nav-tab-btn-hover-dark"} onClick={() => navigate("/dashboard")}>Dashboard</li> : <></>}
                <li className={navState ? "nav-tab-btn nav-tab-btn-hover" : "nav-tab-btn nav-tab-btn-hover-dark"} style={navState ? { borderColor: "var(--c1)", boxShadow: "inset 0 0 0 0 var(--c1)" } : { borderColor: "var(--c3)" }} onClick={currentUser ? logout : () => { navigate("/login") }}>{currentUser ? loading ? <>Loading...</> : "userData" ? "Logout" : "" : "Login"}</li>
            </ul>
        </div >
    )
}

export default Navbar