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
    useEffect(() => {
        const attemptToGetUser = async () => {
            localStorage.setItem(LOCAL_STORAGE_API_TOKEN_KEY, "s93dzyzg5xxc7jyyfkdy670yzo09u478xpmxd3j1")
            let key = localStorage.getItem(LOCAL_STORAGE_API_TOKEN_KEY)
            if (key){
                console.log(key)
                let userResponse = await getUser(key)
                if (userResponse){
                    setUser(userResponse)
                    setApiToken(key)
                }
            }
        }
        attemptToGetUser()
    }, []);
    const getChannels = async () => {
        let route = "channels"
        let method = "GET"
        let body = null
        let { data, statusCode } = await makeRequest(route, method, body, apiToken)
        if(statusCode === 403){
            alert("There was an error fetching the channels")
        }else{
            return data
        }
    }
    const createChannel = async (name) => {
        let route = "channels"
        let method = "POST"
        let body = { name }
        let { data, statusCode } = await makeRequest(route, method, body, apiToken)
        if(statusCode === 403){
            alert(data.message)
        }else{
            return data
        }
    }

    return (
        <UserContext.Provider value={{user, setUser, apiToken, currentChannel, setCurrentChannel, getChannels, createChannel}}>
            {children}
        </UserContext.Provider>
    )
}


