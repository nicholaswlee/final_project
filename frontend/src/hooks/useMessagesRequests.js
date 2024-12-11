import { makeRequest } from "../requests/request"
import React from "react"

export const useMessagesRequests = (channel, token) => {
    const PREFIX = `channels/${channel}/messages`
    const getMessages = async () => {
        let route = PREFIX
        let method = "GET"
        let body = null
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 403){
            alert("Unable to retrieve messages. Please make sure you are logged in correctly")
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
            alert("Unable to retrieve replies. Please make sure you are logged in correctly")
        }else{
            return data
        }
    }
    const postMessage = async (body) => {
        let route = PREFIX
        let method = "POST"
        let content = { body }
        let { data, statusCode } = await makeRequest(route, method, content, token)
        if(statusCode === 403){
            alert("Unable to post message. Please make sure you are logged in correctly")
        }else{
            return data
        }
    }
    const postReply = async (messageId, body) => {
        let route = `${PREFIX}/${messageId}`
        let method = "POST"
        let content = { body }
        let { data, statusCode } = await makeRequest(route, method, content, token)
        if(statusCode === 403){
            alert("Unable to post message. Please make sure you are logged in correctly")
        }else{
            return data
        }
    }
    const postReaction = async (messageId, emoji) => {
        let route = `${PREFIX}/${messageId}/reactions`
        let method = "POST"
        let content = { emoji }
        let { data, statusCode } = await makeRequest(route, method, content, token)
        if(statusCode === 403){
            alert("Unable to post message. Please make sure you are logged in correctly")
        }else{
            return data
        }
    }

    const deleteReaction = async (messageId, emoji) => {
        let route = `${PREFIX}/${messageId}/reactions`
        let method = "DELETE"
        let content = { emoji }
        let { data, statusCode } = await makeRequest(route, method, content, token)
        if(statusCode === 403){
            alert("Unable to post message. Please make sure you are logged in correctly")
        }else{
            return data
        }
    }

    return { getMessages, getRepliesForMessage, postMessage, postReply, postReaction, deleteReaction }
}