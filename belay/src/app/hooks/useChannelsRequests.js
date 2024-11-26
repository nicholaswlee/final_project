

export const useChannelsRequests = (token) => {
    const getChannels = async () => {
        let route = "channels"
        let method = "GET"
        let body = null
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 400){
            alert(data.message)
        }else{
            return data
        }
    }
    const createChannel = async (name) => {
        let route = "channels"
        let method = "POST"
        let body = { name }
        let { data, statusCode } = await makeRequest(route, method, body, token)
        if(statusCode === 400){
            alert(data.message)
        }else{
            return data
        }
    }
}