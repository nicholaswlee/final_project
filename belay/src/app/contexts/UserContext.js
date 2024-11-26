import React, {createContext, useEffect, useState} from 'react';
import { LOCAL_STORAGE_API_TOKEN_KEY } from '../constants';
import { useUserRequests } from '../hooks/useUserRequests';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const {getUser} = useUserRequests(null);
    const [currentChannel, setCurrentChannel] = useState(null);
    useEffect(() => {
        const attemptToGetUser = async () => {
            key = localStorage.getItem(LOCAL_STORAGE_API_TOKEN_KEY)
            if (key){
                user = await getUser(key)
                if (user){
                    setUser(user)
                }
            }
        }
        attemptToGetUser()
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, currentChannel, setCurrentChannel}}>
            {children}
        </UserContext.Provider>
    )
}


