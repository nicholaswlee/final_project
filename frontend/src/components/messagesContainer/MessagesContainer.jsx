import React from 'react'
import {Route, Routes} from 'react-router-dom'
import MessagesContent from '../messagesContent/MessagesContent'

function MessagesContainer({shouldHideClass}) {
  return (
    <Routes>
      <Route path="/channels/:channelId/*" element={
        <MessagesContent shouldHideClass={shouldHideClass}/>}/>
      <Route path="*" element={<div className={`messages-container ${shouldHideClass}`}
        ><div className="empty-container" >
          Select a channel to begin
        </div></div>}/>
    </Routes>
  )
}

export default MessagesContainer