import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'


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
            Signup
            <input onChange={handleSignupInputs} value={signupInputs.orgUsername} name="orgUsername" type="text" placeholder='Org Admin UserName' />
            <input onChange={handleSignupInputs} value={signupInputs.orgEmail} name="orgEmail" type="text" placeholder='Org Admin Email' />
            <input onChange={handleSignupInputs} value={signupInputs.orgPassword} name="orgPassword" type="password" placeholder='Password' />
            <button onClick={handleSignup}>Signup</button>
        </div>
    )
}

export default Signup