import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMessagesRequests } from '../../hooks/useMessagesRequests'
import { UserContext } from '../../contexts/UserContext'
import MessageTile from '../messageTile/MessageTile'
import CommentContainer from '../commentContainer/CommentContainer'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material'

function MessagesContent({shouldHideClass}) {
    const {channelId} = useParams()
    const {apiToken, currentMessage, currentChannel, setCurrentMessage} = useContext(UserContext)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const {getMessages, postMessage, postReaction, deleteReaction} = useMessagesRequests(channelId, apiToken)
    const [messages, setMessages] = useState([])
    // const [currentMessageId, setCurrentMessageId] = useState(null)
    useEffect(() => {
        const attemptToLoadMessages = async () => {
            let messagesRequests = await getMessages()
            if (messagesRequests){
                setMessages(messagesRequests)
                let path_items = pathname.split("/")
                let id = (path_items.length > 4 && path_items[3] == "messages") ? path_items[4] : null
                if(id && messagesRequests.find(message => message.message_id == id)){
                    setCurrentMessage(messagesRequests.find(message => message.message_id == id))
                }else{
                    setCurrentMessage(null)
                }
            }
        }
        let intervalId = setInterval(attemptToLoadMessages, 500)
        return () => clearInterval(intervalId)
    }, [channelId, pathname])

    const handleOpenReplies = (message) => {
        setCurrentMessage(message)
        if(pathname !== `/channels/${channelId}/messages/${message.message_id}`){
            navigate(`/channels/${channelId}/messages/${message.message_id}`);
        }
    }
    const goBack = () => {
        navigate("/");
    }
    return <div className={`messages-container ${shouldHideClass}`}>
         <div className="back-header-hidden">
        <IconButton onClick={goBack}>
            <ArrowBackIcon className="back-button"/>
        </IconButton>
         In #{currentChannel && currentChannel.channel_name}
    </div>
        <div className="messages">
    {(messages.length === 0) ? <div className="empty-container">
        There are no messages in this channel. Be the first to post one!
    </div> : messages.map((message) => {
        return <MessageTile key={message.message_id} message={message} handleOpenReplies={() => handleOpenReplies(message)}
            postReaction={(emoji) => postReaction(message.message_id, emoji)}
            deleteReaction={(emoji) => deleteReaction(message.message_id, emoji)}/>
    })}
    </div>
        <CommentContainer postComment={(body) => {postMessage(body)}} />
    </div>
}

export default MessagesContent