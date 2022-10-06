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
    const [isOrg, setIsOrg] = useState(false)
    const navigate = useNavigate()

                ////////////////////////////////////////////////////////////
    //////////////////////////AUTH FUNCTIONS START HERE//////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

    async function signup(orgData) {
        // setLoading(true)
        const signupReq = {
            username: orgData.orgUsername,
            email: orgData.orgEmail,
            password: orgData.orgPassword
        }

        try {
            const response = await axios.post("org/signup", signupReq, { withCredentials: true })
            if (response.hasOwnProperty("data")) {
                console.log(response.data);
            } else throw response
            // setLoading(false)
        } catch (error) {
            // setLoading(false)
            throw error.response.data.message
        }
    }

    async function orgLogin(loginInputs) {
        // setLoading(true)
        const loginReq = {
            email: loginInputs.orgEmail,
            password: loginInputs.orgPassword
        }
        console.log(loginReq);
        try {
            const response = await axios.post("org/login", loginReq)
            if (response.hasOwnProperty("data")) {
                console.log(response.data);
            } else {
                console.log(response);
                throw response
            }
            axios.defaults.headers.common['Authorization'] = `${response.data['accessToken']}`
            console.log(response);
            setCurrentUser(response.data.userId)
            setIsOrg(true)
            // setLoading(false)
        } catch (error) {
            console.log(error.response.data.message);
            // setLoading(false)
            throw error.response.data.message
        }
    }

    async function userLogin(loginInputs) {
        // setLoading(true)
        const loginReq = {
            email: loginInputs.orgEmail,
            password: loginInputs.orgPassword
        }
        console.log(loginReq);
        try {
            const response = await axios.post("user/login", loginReq)
            if (response.hasOwnProperty("data")) {
                console.log(response.data);
            } else {
                console.log(response);
                throw response
            }
            axios.defaults.headers.common['Authorization'] = `${response.data['accessToken']}`
            console.log(response);
            setCurrentUser(response.data.userId)
            setIsOrg(false)
            // setLoading(false)
        } catch (error) {
            console.log(error.response.data.message);
            // setLoading(false)
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

    async function checkToken() {
        // setLoading(true)
        try {
            const response = await axios.post("refreshToken", {})
            if(response.hasOwnProperty("data")) {
                if (response.data.error == false) {
                    setCurrentUser(response.data.userId)
                    setIsOrg(response.data.isOrg)
                    axios.defaults.headers.common['Authorization'] = `${response.data['accessToken']}`
                    return true
                }
            }
            else throw response
            // setLoading(false)
        } catch (error) {
            console.error(error);
            logout()
            navigate("/login")
            throw error.response.data.message
        }
    };
//////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////AUTH FUNCTIONS END HERE//////////////////////////////
                ////////////////////////////////////////////////////////////


                ////////////////////////////////////////////////////////////
    //////////////////////////ORG DATA FUNCTIONS START HERE//////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
    async function getData() {
        if(!currentUser) return {error: true, message: "User not found."}
        try {
            let res
            if(isOrg)
                res = await axios.post("org/details", {userId: currentUser})
            else 
                res = await axios.post("user/details", {userId: currentUser})
            if(res.hasOwnProperty("data")) {
                return res.data.data
            } else throw res
        } catch (error) {
            console.error(error);
            throw error.response.data.message
        }
    }

    async function getCurrentEvent() {
        if(!currentUser) return {error: true, message: "User not found."}
        try {
            let res = await axios.post("event/details", {userId: currentUser})
            if(res.hasOwnProperty("data")) {
                return res.data.data
            } else throw res
        } catch (error) {
            console.error(error);
            throw error.response.data.message
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////ORG DATA FUNCTIONS END HERE//////////////////////////////
                ////////////////////////////////////////////////////////////


    useEffect(() => {
        if (checkTokenCookie)
            checkToken();
        else navigate("/login")
        // if(currentUser) getUserData(currentUser)
    }, [checkTokenCookie, currentUser]);


    const value = {
        currentUser,
        userData,
        orgLogin,
        userLogin,
        signup,
        logout,
        getData,
        isOrg,
        getCurrentEvent
        // userNotifications,
        // getUserData
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}