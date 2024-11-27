"use client";
import React, { useContext } from 'react'
import ChannelsContainer from '../channelsContainer/ChannelsContainer'
import MessagesContainer from '../messagesContainer/MessagesContainer'
import RepliesContainer from '../repliesContainer/RepliesContainer'
import { UserContext } from '../../contexts/UserContext'

function BodyContainer() {
    const {user} = useContext(UserContext);
  return<> 
    {user ? 
        <div className="body-container">
            <ChannelsContainer/>
            <MessagesContainer/>
            <RepliesContainer/>
        </div>
        :
        <div className="body-container">
            <h2>Log in to see your messages</h2>
        </div>
    }
    </>
  
}

export default BodyContainer