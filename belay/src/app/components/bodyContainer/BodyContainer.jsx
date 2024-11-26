import React from 'react'
import ChannelsContainer from '../channelsContainer/ChannelsContainer'
import MessagesContainer from '../messagesContainer/MessagesContainer'
import RepliesContainer from '../repliesContainer/RepliesContainer'

function BodyContainer() {
  return (
    <div class="body-container">
        <ChannelsContainer/>
        <MessagesContainer/>
        <RepliesContainer/>
    </div>
  )
}

export default BodyContainer