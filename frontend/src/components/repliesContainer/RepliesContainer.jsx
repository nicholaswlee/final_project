import React from 'react'
import {Route, Routes} from 'react-router-dom'

function RepliesContainer() {
  return (
      <Routes>
        <Route path="/channels/:channelId/messages/:messageId" element={<div className="replies-container">Displaying reply content</div>}/>
        <Route path="*" element={<></>}/>
    </Routes>
  )
}

export default RepliesContainer