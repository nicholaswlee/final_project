import { useContext } from "react"
import { makeRequest } from "../requests/request"
import { UserContext } from "../contexts/UserContext"

export const useChannelsRequests = () => {
    const {apiToken} = useContext(UserContext)
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
            alert("There was an error creating the channel")
        }else if(statusCode === 409){
            alert("Channel already exists")
        }else{
            return data
        }
    }
    return { getChannels, createChannel }
}