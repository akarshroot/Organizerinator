import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


function Login() {
    const { signup, login } = useAuth()
    const [loginInputs, setLoginInputs] = useState({
        orgUsername: "",
        orgPassword: ""
    })

    function handleLoginInputs(event) {
        let name = event.target.name
        let value = event.target.value
        setLoginInputs((lastVal) => {
            return {
                ...lastVal,
                [name]: value
            }
        })
    }

    // function handleLogin() {

    // }

    return (
        <div className='page-container'>
            Login
            <input onChange={handleLoginInputs} value={loginInputs.orgPassword} name="orgPassword" type="password" placeholder='Password' />
            <input onChange={handleLoginInputs} value={loginInputs.orgUsername} name="orgUsername" type="text" placeholder='Org Admin UserName' />
            <button onClick={() => console.log(loginInputs)}>Login</button>
            <br/>
            <Link to="/signup">SignUp</Link>
        </div>
    )
}

export default Login