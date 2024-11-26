import { BACKEND_URL } from '../constants'

export const makeRequest = async (endPoint, method, body, token) => {
    let url = `${BACKEND_URL}/api/${endPoint}`
    let headers = {
        'Content-Type': 'application/json',
    }
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }
    
    let options = {
        method: method,
        headers: headers
    }
    if (body) {
        options.body = JSON.stringify(body)
    }
    let response = await fetch(url, options)
    let data = await response.json()
    let statusCode = response.status
    return { data, statusCode }
}