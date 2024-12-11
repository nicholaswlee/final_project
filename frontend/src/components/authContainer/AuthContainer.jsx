import React, {useContext, useState} from 'react'
import StyledButton from '../core/styledButton/StyledButton'
import AuthModal from '../authModal/AuthModal'
import { UserContext } from '../../contexts/UserContext'
import { useUnauthenticatedRequests } from '../../hooks/useUnauthenicatedRequests'

function AuthContainer() {
    const [signUpOpen, setSignUpOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)
    const {setUser, setApiToken} = useContext(UserContext)
    const {signUp, login} = useUnauthenticatedRequests()
  return (
    <div className="auth-container">
        <h1>Welcome to Belay</h1>
        <p>
            Belay is a messaging app that allows you to communicate with your team in real time.
            You can create channels, post messages, and reply to messages all on one platform. 
            It's time to <b>advance</b> the way you communicate with your team.
        </p>
        <div className="auth-button-container">
            <StyledButton
                name="Sign Up"
                onClick={() => setSignUpOpen(true)}
                color="#2ed573"
                hoverColor='#7bed9f'
            />
            <StyledButton
                name="Log In"
                onClick={() => setLoginOpen(true)}
                color="#3742fa"
                hoverColor='#1e90ff'
            />
        </div>
       <AuthModal 
            isOpen={signUpOpen} 
            onClose={() => setSignUpOpen(false)}
            setUser={setUser}
            setApiToken={setApiToken}
            authAction={signUp}
            authMessage="Sign Up"
        />
        <AuthModal 
            isOpen={loginOpen} 
            onClose={() => setLoginOpen(false)}
            setUser={setUser}
            setApiToken={setApiToken}
            authAction={login}
            authMessage="Log In"
        />

    </div>
  )
}

export default AuthContainer