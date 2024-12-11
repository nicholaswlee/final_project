import React, {useState} from 'react'
import Modal from '../core/modal/Modal'
import StyledInput from '../core/styledInput/StyledInput'
import StyledButton from '../core/styledButton/StyledButton'

function AuthModal({isOpen, onClose, setUser, setApiToken, authAction, authMessage}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = async () => {
        if(!username || !password){
            alert("Please enter a username and password")
            return
        }
        const response = await authAction(username, password)
        if(response){
            setApiToken(response.api_key)
            setUser(response)
            onClose()
        }
    }
  return <Modal isOpen={isOpen} onClose={onClose}>
    <h2>{authMessage}</h2>
    <StyledInput name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
    <StyledInput name="password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
    <StyledButton name={authMessage} onClick={handleSignUp}/>
  </Modal>
}

export default AuthModal