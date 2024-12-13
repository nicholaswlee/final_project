import React, { useContext, useEffect, useState } from 'react'
import ChannelsContainer from '../channelsContainer/ChannelsContainer'
import MessagesContainer from '../messagesContainer/MessagesContainer'
import RepliesContainer from '../repliesContainer/RepliesContainer'
import { UserContext } from '../../contexts/UserContext'
import AuthContainer from '../authContainer/AuthContainer';
import { useLocation } from 'react-router-dom';


const CHANNEL = 1
const MESSAGES = 2
const REPLIES = 3

function BodyContainer() {
    const {user} = useContext(UserContext);
    const { pathname } = useLocation()
    const [currentScreen, setCurrentScreen] = useState(CHANNEL)
    useEffect(() => {
        const path_items = pathname.split("/")
        if(path_items.find(item => item === "messages")){
            setCurrentScreen(REPLIES)
        }else if(path_items.find(item => item === "channels")){
            setCurrentScreen(MESSAGES)
        }else{
            setCurrentScreen(CHANNEL)
        }
    }, [pathname])

    const shouldAddHide = (screen) => {
        return currentScreen !== screen ? "hide-on-small" : ""
    }
  return<> 
    {user ? 
        <div className="body-container">
            <ChannelsContainer shouldHideClass={shouldAddHide(CHANNEL)}/>
            <MessagesContainer shouldHideClass={shouldAddHide(MESSAGES)}/>
            <RepliesContainer shouldHideClass={shouldAddHide(REPLIES)}/>
        </div>
        :
        <div className="body-container">
            <AuthContainer/>
        </div>
    }
    </>
  
}

export default BodyContainer