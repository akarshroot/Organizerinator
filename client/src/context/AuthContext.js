import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios'
// import { io } from 'socket.io-client'
// import { SOCKET_URL as socketURL } from './config'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const cookies = Cookies; //constructor method depreciated
    const checkTokenCookie = cookies.get("checkToken");
    const [currentUser, setCurrentUser] = useState()
    const [userData, setUserData] = useState()
    const [userNotifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function signup(orgData) {
        setLoading(true)
        const signupReq = {
            username: orgData.orgUsername,
            email: orgData.orgEmail,
            password: orgData.orgPassword
        }

        try {
            const response = await axios.post("org/signup", signupReq, { withCredentials: true })
            if(response.hasOwnProperty("data")) {
                console.log(response.data);
            } else throw response
            setLoading(false)
        } catch (error) {
            throw error.response.data.message
        }
    }

    async function orgLogin(email, password) {
        setLoading(true)
        const loginReq = {
            email: email,
            password: password
        }
        try {
            const response = await axios.post("org/login", loginReq)
            if(response.hasOwnProperty("data")) {
                console.log(response.data);
            } else throw response
            axios.defaults.headers.common['Authorization'] = `${response.data['accessToken']}`
            console.log(response);
            setCurrentUser(response.data.user)
        } catch (error) {
            throw error.response.data.message
        }
    }

    async function logout() {
        try {
            const { data } = await axios.delete("refreshToken", {}, { withCredentials: true })
            console.log(data);
            setCurrentUser(null)
            setUserData(null)
            cookies.remove("checkToken")
            cookies.remove("refreshToken")
            navigate("/login")
        } catch (error) {
            console.error("Axios errr" + error);
        }
    }

    async function getUserData(uid) {
        try {
            const { data } = await axios.post("users/details", { uid: uid })
            setUserData(data.user)
        } catch (error) {
            console.error(error);
        }
    }

    async function checkToken() {
        setLoading(true)
        try {
            const { data } = await axios.post("refreshToken", {})
            if (data.error == false) {
                setCurrentUser(data.userId)
                axios.defaults.headers.common['Authorization'] = `${data['accessToken']}`
                return true
            }
            if (data.error) {
                logout()
                return false
            }
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (checkTokenCookie)
            checkToken();
        // if(currentUser) getUserData(currentUser)
    }, [checkTokenCookie, currentUser]);


    const value = {
        currentUser,
        userData,
        orgLogin,
        signup,
        logout,
        // userNotifications,
        // getUserData
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}