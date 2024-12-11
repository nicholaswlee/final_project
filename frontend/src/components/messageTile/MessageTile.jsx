import React, {useContext, useEffect, useState} from 'react'
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import StyledButton from "../core/styledButton/StyledButton"
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import { UserContext } from '../../contexts/UserContext';
import Popover from '@mui/material/Popover';
import ChatIcon from '@mui/icons-material/Chat';
function MessageTile({message, handleOpenReplies, postReaction, deleteReaction }) {
  const {user} = useContext(UserContext)
    let timeStamp = new Date(message.time_posted * 1000)
    let timeString = timeStamp.toLocaleString()
    let replyOrReplies = message.reply_count === 1 ? "reply" : "replies"
    const [emojis, setEmojis] = useState(
      message.reactions || {}
    );
    useEffect(() => {
      setEmojis(message.reactions || {})
    }, [message])
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const toggleEmoji = (unified) => {
      let newEmojis = {}
      if(isEmojiSelected(unified)){
        deleteReaction(unified)
        newEmojis = {
          ...emojis,
          [unified]: emojis[unified].filter(name => name !== user.name)
        }
      }else{
        postReaction(unified)
        newEmojis = {
          ...emojis,
          [unified]: [...emojis[unified] || [], user.name]
        }
      }
      if(newEmojis[unified].length === 0){
        delete newEmojis[unified]
      }
      return newEmojis
    }
    const onPickerClick = (emojiObject, mouseDownEvent) => {
      setEmojis(toggleEmoji(emojiObject.unified));
      setIsPickerVisible(false);
    };
    const onEmojiClick = (unified) => {
      setEmojis(toggleEmoji(unified))
    }
    const isEmojiSelected = (unified) => {
      return emojis[unified] && emojis[unified].includes(user.name)
    }
    
    const getImages = (text) => {
      console.log(text)
      const images = [...text.matchAll(/http.+?(jpe?g|gif|png)/ig)].map((match) => match[0])
  
      console.log(images)
      return images.map((image, i) => {
        return <img key={i} src={image} alt="message image" className="message-image"/>
      })
    }
    const replaceText = (text) => {
      return text.replace(/http.+?(jpe?g|gif|png)/ig, (match) => {
        return `<img src="${match}" alt="message image" class="message-image"/>`
      })
    }
  return (
    <div className="message-tile">
        <p><b>{message.user_name}</b> {timeString}</p>
        {/* {getImages(message.body)} */}

        <p dangerouslySetInnerHTML={{ __html: replaceText(message.body) }} />
          <div className='reactions-container'>

        {Object.entries(emojis).map(([emoji, names], i) => {
          return <Tooltip title={<>
            {names.map((name, j) => {
              return <p key={j}>{name}</p>
            })}
          </>} placement="top"> 
          <IconButton style={(isEmojiSelected(emoji)) ? {backgroundColor: "#3ba3f7", borderRadius: 20, margin: 4} : {}} onClick={() => onEmojiClick(emoji)}>
              <Emoji key={i} unified={emoji} size="25" />
              <div className="reaction-text">  {names.length}</div>
            </IconButton>
          </Tooltip>
        
        }
           )
        }
        <Tooltip title="Add reaction +">
          <IconButton onClick={() => setIsPickerVisible(true)}>
            +
          </IconButton>
        </Tooltip>
        { handleOpenReplies && <Tooltip title="Reply">
          <IconButton onClick={() => handleOpenReplies()}>

            <ChatIcon />
          </IconButton>
          </Tooltip>}
          {message.reply_count > 0 && <p onClick={() => handleOpenReplies()}>Has {message.reply_count} {replyOrReplies}</p>}
        </div>
        <Popover 
          open={isPickerVisible}
          anchorReference="anchorPosition"
          anchorPosition={{left: 200}}
          onClose={() => setIsPickerVisible(false)}>
          <EmojiPicker onEmojiClick={onPickerClick} />
          </Popover>
    </div>
  )
}

export default MessageTile