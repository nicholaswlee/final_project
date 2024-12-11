import React, { useContext, useEffect, useState } from 'react'
import { useMessagesRequests } from '../../hooks/useMessagesRequests'
import { UserContext } from '../../contexts/UserContext'
import { useNavigate, useParams } from 'react-router-dom'
import MessageTile from '../messageTile/MessageTile'
import CommentContainer from '../commentContainer/CommentContainer'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Close from '@mui/icons-material/Close';
import { IconButton } from '@mui/material'

function RepliesContent() {
    const {apiToken, currentMessage, currentChannel} = useContext(UserContext)
    const {channelId, messageId} = useParams()
    const navigate = useNavigate()
    const {getRepliesForMessage, postReply, postReaction, deleteReaction} = useMessagesRequests(channelId, apiToken)
    const [replies, setReplies] = useState([])

    useEffect(() => {
        setReplies([])
        const attemptToLoadReplies = async () => {
            let repliesRequests = await getRepliesForMessage(messageId)
            if (repliesRequests){
                setReplies(repliesRequests)
            }else{
                setReplies([])
            }
        }
        let intervalId = setInterval(attemptToLoadReplies, 500)
        return () => clearInterval(intervalId)
    }, [messageId])

    const goBack = () => {
        navigate(`/channels/${channelId}`);
    }
  return <div className="replies-container">
    <div className="back-header-hidden">
        <IconButton onClick={goBack}>
            <ArrowBackIcon className="back-button"/>
        </IconButton>
         Return to the main thread of #{currentChannel && currentChannel.channel_name}
    </div>
    <div className="back-header">
        Thread
        <IconButton onClick={goBack}>
            <Close className="back-button"/>
        </IconButton>
    </div>
    <div className="replies">
    {currentMessage && <MessageTile message={{...currentMessage, reply_count: 0}} handleOpenReplies={null} 
        postReaction={(emoji) => postReaction(currentMessage.message_id, emoji)}
        deleteReaction={(emoji) => deleteReaction(currentMessage.message_id, emoji)}
        />
        }
    {
    replies.length > 0 && replies.map((reply) => {
        return <MessageTile key={reply.message_id} message={reply} handleOpenReplies={null}
        postReaction={(emoji) => postReaction(reply.message_id, emoji)}
        deleteReaction={(emoji) => deleteReaction(reply.message_id, emoji)}
        />
    })}
    </div>
    <CommentContainer postComment={(body) => postReply(messageId, body)}/>

  </div>
}

export default RepliesContent