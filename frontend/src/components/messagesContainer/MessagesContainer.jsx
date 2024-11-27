import React from 'react'
import {Route, Routes} from 'react-router-dom'

function MessagesContainer() {
  return (
    <Routes>
      <Route path="/channels/:channelId/*" element={<div className="messages-container">Displaying channel content</div>}/>
      <Route path="*" element={<div className="messages-container">Select a channel to begin</div>}/>
    </Routes>
  )
}

export default MessagesContainer