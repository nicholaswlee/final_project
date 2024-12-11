import React from 'react'
import {Route, Routes} from 'react-router-dom'
import RepliesContent from '../repliesContent/RepliesContent'

function RepliesContainer() {
  return (
      <Routes>
        <Route path="/channels/:channelId/messages/:messageId/*" element={<RepliesContent/>}/>
        <Route path="*" element={<></>}/>
    </Routes>
  )
}

export default RepliesContainer