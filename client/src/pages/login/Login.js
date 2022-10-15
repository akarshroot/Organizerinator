import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'


function Login() {
    const { orgLogin, userLogin } = useAuth()
    const [loginInputs, setLoginInputs] = useState({
        orgEmail: "",
        orgPassword: ""
    })
    const [errorMsg, setErrorMsg] = useState("")
    const [isOrg, toggleIsOrg] = useState(false)
    const { currentUser } = useAuth()
    const navigate = useNavigate()

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

    async function handleLogin(e) {
        e.preventDefault()
        try {
            if (isOrg)
                await orgLogin(loginInputs)
            else
                await userLogin(loginInputs)
        } catch (error) {
            console.log(error);
            // setErrorMsg(error)
        }
    }

    useEffect(() => {
        if (currentUser) navigate("/dashboard")
    }, [currentUser])


    return (
        <div className='page-container'>
            <div className="login-container">
                <h1>Login</h1>
                {/* <p>{errorMsg}</p> */}
                <form onSubmit={handleLogin}>
                    <input onChange={handleLoginInputs} value={loginInputs.orgEmail} name="orgEmail" type="text" placeholder='Org Admin Email' /><br />
                    <input onChange={handleLoginInputs} value={loginInputs.orgPassword} name="orgPassword" type="password" placeholder='Password' /><br />
                    <input onChange={() => toggleIsOrg(!isOrg)} type='checkbox' name="isOrg" checked={isOrg} /><label htmlFor='isOrg'>&nbsp;Org Login</label><br />
                    <button>Login</button>
                </form>
                <br />
                <Link to="/signup">SignUp</Link>
            </div>
        </div>
    )
}

export default Login