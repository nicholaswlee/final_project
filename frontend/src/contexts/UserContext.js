"use client";
import React, {createContext, useEffect, useState} from 'react';
import { LOCAL_STORAGE_API_TOKEN_KEY } from '../constants';
import { useUserRequests } from '../hooks/useUserRequests';
import { makeRequest } from '../requests/request';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const {getUser} = useUserRequests(null);
    const [apiToken, setApiToken] = useState(null);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [currentMessage, setCurrentMessage] = useState(null);
    useEffect(() => {
        const attemptToGetUser = async () => {
            // localStorage.setItem(LOCAL_STORAGE_API_TOKEN_KEY, "s93dzyzg5xxc7jyyfkdy670yzo09u478xpmxd3j1")
            let key = localStorage.getItem(LOCAL_STORAGE_API_TOKEN_KEY)
            if (key){
                let userResponse = await getUser(key)
                if (userResponse){
                    setUser(userResponse)
                    setApiToken(key)
                }
            }
        }
        attemptToGetUser()
    }, []);

    useEffect(() => {
        if(!apiToken){
            setUser(null)
        }else{
            localStorage.setItem(LOCAL_STORAGE_API_TOKEN_KEY, apiToken)
        }
    }, [apiToken])

    return (
      <UserContext.Provider
        value={{
            user,
            setUser,
            apiToken,
            setApiToken,
            currentChannel,
            setCurrentChannel,
            currentMessage,
            setCurrentMessage
        }}
      >
        {children}
      </UserContext.Provider>
    );
}


