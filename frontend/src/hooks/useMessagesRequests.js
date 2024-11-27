import { makeRequest } from "../requests/makeRequest"
import React from "react"

export const useMessagesRequests = (channel, token) => {
    const PREFIX = `channels/${channel}/messages`
    const getMessages = async () => {
        let route = PREFIX
        let method = "GET"
        let body = null
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 403){
            alert(data.message)
        }else{
            return data
        }
    }
    const getRepliesForMessage = async (messageId) => {
        let route = `${PREFIX}/${messageId}`
        let method = "GET"
        let body = null
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 403){
            alert(data.message)
        }else{
            return data
        }
    }
    const postMessage = async (body) => {
        let route = PREFIX
        let method = "POST"
        let body = { body }
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 403){
            alert(data.message)
        }else{
            return data
        }
    }
    const postReply = async (messageId, body) => {
        let route = `${PREFIX}/${messageId}`
        let method = "POST"
        let body = { body }
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 403){
            alert(data.message)
        }else{
            return data
        }
    }
    return { getMessages, getRepliesForMessage, postMessage, postReply }
}