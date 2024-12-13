import { IconButton } from '@mui/material'
import { UserContext } from '../../contexts/UserContext'
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Modal from '../core/modal/Modal'
import StyledButton from '../core/styledButton/StyledButton'
import StyledInput from '../core/styledInput/StyledInput'
import { useChannelsRequests } from '../../hooks/useChannelsRequests'
import TagIcon from '@mui/icons-material/Tag';

function ChannelsContainer({shouldHideClass}) {
    const { currentChannel, setCurrentChannel} = useContext(UserContext)
    const { getChannels, createChannel} = useChannelsRequests()
    const [channels, setChannels] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [newChannelName, setNewChannelName] = useState("")
    const { pathname } = useLocation()
    const navigate = useNavigate();  // React Router v6
    useEffect(() => {
        const attemptToGetChannels = async () => {
            const channelsResponse = await getChannels()
            let path_items = pathname.split("/")
            let id = (path_items.length > 2 && path_items[1] == "channels") ? path_items[2] : null
            if (channelsResponse){
                if(id && channelsResponse.find(channel => channel.channel_id == id)){
                    setCurrentChannel(channelsResponse.find(channel => channel.channel_id == id))
                }else{
                    setCurrentChannel(null)
                }
                console.log(channelsResponse)
                setChannels(channelsResponse)
            }
        }
        let intervalId = setInterval(attemptToGetChannels, 500)
        return () => clearInterval(intervalId)
    }, [pathname])

    useEffect(() => {
        setNewChannelName("")
    }, [isOpen])

    const handleChannelClick = (channel) => {
        setCurrentChannel(channel)
        const channelId = channel.channel_id
        if(!pathname.startsWith(`/channels/${channelId}`)){
            navigate(`/channels/${channelId}`);
        }
    }

    const handleChannelCreation = async (channelName) => {
        if(!channelName){
            alert("Please enter a channel name")
            return
        }
        const response = await createChannel(channelName)
        if(response){
            setCurrentChannel(response)
            navigate(`/channels/${response.channel_id}`);
            setIsOpen(false)
        }
    }
    
    return (
        <>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2>Create a channel</h2>
                <StyledInput name="channel-name" placeholder="Channel Name" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)}/>
                <div className="button-container">
                    <StyledButton name="Create" onClick={() => handleChannelCreation(newChannelName)}/>
                    <StyledButton name="Cancel" onClick={() => setIsOpen(false)} color="#ced6e0" hoverColor='#dfe4ea'/>
                </div>

       

            </Modal>
        <div className={`channels-container ${shouldHideClass}`}>
            <h2 key={-1} className="channels-title">Channels
                <IconButton onClick={() => setIsOpen(true)}>
                    +
                </IconButton>
            </h2>
            <div className="channels-list">
            {channels && channels.map(channel => {
                return (
                    <div key={channel.channel_id} className={`channel-name ${channel.channel_id == currentChannel?.channel_id ? "selected" : ""}`} 
                        onClick={() =>  handleChannelClick(channel)}>
                        <TagIcon/> <span>{channel.channel_name} {(channel.unread_count !== 0) && <span className={`unread-count ${channel.channel_id == currentChannel?.channel_id ? "selected" : ""}`}> {channel.unread_count}</span>} </span>
                    </div>
                )
            })}
            </div>
            

        </div>
        </>
    )
}

export default ChannelsContainer