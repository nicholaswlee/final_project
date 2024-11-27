import { makeRequest } from "../requests/request"
export const useUserRequests = (token) => {
    const getUser = async (givenToken=token) => {
        let route = "user"
        let method = "GET"
        let body = null
        console.log("token", givenToken)
        let { data, statusCode } = await makeRequest(route, method, body, givenToken)
        if(statusCode === 403){
            alert(data.message)
            return null
        }else{
            return data
        }
    }
    const updateUserName = async (name, givenToken=token) => {
        let route = "user/name"
        let method = "POST"
        let body = { name }
        let { data, statusCode } = await makeRequest(route, method, body, givenToken)
        if(statusCode === 403){
            alert(data.message)
            return null
        }else{
            return data
        }
    }
    const updateUserPassword = async (password, givenToken=token) => {
        let route = "user/password"
        let method = "POST"
        let body = { password }
        let { data, statusCode } = await makeRequest(route, method, body, givenToken)
        if(statusCode === 403){
            alert(data.message)
            return null
        }else{
            return data
        }
    }
    return { getUser, updateUserName, updateUserPassword }
}
