import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Signup.css'

function Signup() {
    const { signup, login } = useAuth()
    const [signupInputs, setSignupInputs] = useState({
        orgUsername: "",
        orgEmail: "",
        orgPassword: ""
    })

    function handleSignupInputs(event) {
        let name = event.target.name
        let value = event.target.value
        setSignupInputs((lastVal) => {
            return {
                ...lastVal,
                [name]: value
            }
        })
    }

    async function handleSignup() {
        try {
            await signup(signupInputs)
        } catch (error) {
            console.log("ERRR: ", error);
        }
    }


    return (
        <div className='page-container'>
            <div className="signup-container">
                <h1>Sign-Up</h1>
                <input onChange={handleSignupInputs} value={signupInputs.orgUsername} name="orgUsername" type="text" placeholder='Org Admin UserName' />
                <input onChange={handleSignupInputs} value={signupInputs.orgEmail} name="orgEmail" type="text" placeholder='Org Admin Email' />
                <input onChange={handleSignupInputs} value={signupInputs.orgPassword} name="orgPassword" type="password" placeholder='Password' />
                <button className='button-48' onClick={handleSignup}>
                    <span>
                        Signup
                    </span>
                </button>
                <Link to="/login">Login</Link>
            </div>
        </div>
    )
}

export default Signup