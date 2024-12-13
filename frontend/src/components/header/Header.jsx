import { IconButton, Menu, MenuItem } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, {useContext, useState} from 'react'
import { UserContext } from '../../contexts/UserContext';
import EditProfileModal from '../editProfileModal/EditProfileModal';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const navigate = useNavigate()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const {setApiToken, user} = useContext(UserContext)
  const handleLogout = () => {
    setApiToken(null)
    setAnchorEl(null)
    navigate("/");
  }

  const handleEditProfile = () => {
    setIsEditOpen(true)
    setAnchorEl(null)
  }

  return (
    <div className="navbar">
        <div>b e l a y</div>

        {user && <><IconButton onClick={handleClick} style={{color: "white"}} >
          <AccountCircleIcon />
        </IconButton>
        <Menu 
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          >
          <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </Menu></>}
          <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}/>
    </div>
    
  )
}

export default Header