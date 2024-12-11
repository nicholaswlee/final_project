import { makeRequest } from "../requests/request"
export const useUnauthenticatedRequests = () => {
    const signUp = async (name, password) => {
        let route = "user/signup"
        let method = "POST"
        let body = { name, password }
        let token = null
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 403){
            alert("Username already taken")
            return null
        }else if(statusCode === 409){
            alert("User already exists")
            return null
        }else{
            return data
        }
    }
    const login = async (name, password) => {
        let route = "user/login"
        let method = "POST"
        let body = { name, password }
        let token = null
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 403){
            alert("Invalid login credentials, please try again")
            return null
        }else{
            return data
        }
    }
    return { signUp, login }
}