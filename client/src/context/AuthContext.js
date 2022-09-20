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

    const cookies = new Cookies();
    const checkTokenCookie = cookies.get("checkToken");
    const [currentUser, setCurrentUser] = useState()
    const [userData, setUserData] = useState()
    const [userNotifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [socket, setSocket] = useState(null);
    
    // Socket.io
    // useEffect(() => {
    //     if (currentUser) {
    //         const newSocket = io(`${socketURL}/socket/notification`, { query: { uid: currentUser } });
    //         setSocket(newSocket);
    //         return () => newSocket.close();
    //     }
    // }, [setSocket, currentUser]);


    // if (socket) {
    //     socket.on("connect", () => {
    //         console.log("Socket connected: " + socket.id); // x8WIv7-mJelg7on_ALbx
    //     });

    //     socket.on("newNotification", (notification) => {
    //         setNotifications([notification])
    //     });
    // }

    async function signup(userData) {
        const signupReq = {
            firstName: userData.fname,
            lastName: userData.lname,
            email: userData.email,
            password: userData.password
        }

        try {
            const { data } = await axios.post("signup", signupReq, { withCredentials: true })
            if (data.error == true) throw new Error("Error")
            setLoading(false)
        } catch (error) {
            throw error
        }
    }

    async function login(email, password) {
        const loginReq = {
            email: email,
            password: password
        }
        try {
            const response = await axios.post("login", loginReq)
            // cookies.set("token", res.refreshToken)
            axios.defaults.headers.common['Authorization'] = `${response.data['accessToken']}`
            console.log(response);
            setCurrentUser(response.data.user)
            if (response.data.error) throw new Error("Login Failed. Please try again.")
        } catch (error) {
            console.error(error);
            throw new Error("Invalid email or password.")
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
        login,
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