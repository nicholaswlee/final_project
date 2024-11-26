
export const useUnauthenticatedRequests = () => {
    const signUp = async (name, password) => {
        let route = "signup"
        let method = "POST"
        let body = { name, password }
        let token = null
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 400){
            alert(data.message)
        }else{
            return data
        }
    }
    const login = async (name, password) => {
        let route = "login"
        let method = "POST"
        let body = { name, password }
        let token = null
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 400){
            alert(data.message)
            return null
        }else{
            return data
        }
    }
    return { signUp, login }
}