import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import SendIcon from '@mui/icons-material/Send';

function CommentContainer({postComment}) {
  const [comment, setComment] = useState('')
  const handleChange = (e) => {
    setComment(e.target.value)
  }
  const handleSubmit = () => {
    postComment(comment)
    setComment('')
  }
  return <div className="comment-container">
    <textarea className="comment-area" placeholder='Add a comment...' rows="5" cols="80" value={comment} onChange={handleChange}>
    </textarea>
    
    <IconButton onClick={handleSubmit} disabled={!comment} dis>
    <div className="comment-button" style={(!comment) ? {backgroundColor: "grey", opacity: 0.6} :{} }>
      <SendIcon/>
      </div>
    </IconButton>


    {/* <button className="comment-button" onClick={handleSubmit}>Submit</button> */}
  </div>
}

export default CommentContainer