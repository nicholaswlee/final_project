import React, { useContext, useState } from 'react'
import Modal from '../core/modal/Modal'
import StyledInput from '../core/styledInput/StyledInput'
import StyledButton from '../core/styledButton/StyledButton'
import { UserContext } from '../../contexts/UserContext'
import { useUserRequests } from '../../hooks/useUserRequests'

function EditProfileModal({isOpen, onClose}) {
    const {user, apiToken} = useContext(UserContext)
    const {updateUserName, updateUserPassword} = useUserRequests(apiToken)
    const [username, setUsername] = useState(user ? user.name : "")
    const [password, setPassword] = useState('')

    const handleUsernameUpdate = async () => {
        if(!username){
            alert("Please enter a username")
            return
        }
        const data = await updateUserName(username)
        if(data){
            alert("Username updated")
        }
    }
    const handlePasswordUpdate = async () => {
        if(!password){
            alert("Please enter a password")
            return
        }
        const data = await updateUserPassword(password)
        if(data){
            alert("Password updated")
        }
        // send request to update password
        
    }
  return <Modal isOpen={isOpen} onClose={onClose}>
    <h2>Edit Profile</h2>
    <div className='update-row'>
        <StyledInput name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <StyledButton name="Update" onClick={handleUsernameUpdate}/>
    </div>
    <div className='update-row'>
        <StyledInput name="password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <StyledButton name="Update" onClick={handlePasswordUpdate}/>
    </div>

  </Modal>
}

export default EditProfileModal