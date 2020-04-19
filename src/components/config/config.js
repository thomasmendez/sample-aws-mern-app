
/*
const httpType = process.env.REACT_APP_HTTP_TYPE
const domainName = process.env.REACT_APP_DOMAIN_NAME
const nodePort = process.env.REACT_APP_NODE_PORT
*/
//export const apiURL = `${httpType}://${domainName}:${nodePort}`

import config from 'config'

export const corsOptionsGET = {
    method: 'GET', 
    mode: 'cors',
    credentials: 'include',
    headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `${config.origin}`,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Credentials": true
    }
}

export const corsOptionsPOST = {
    method: 'POST', 
    mode: 'cors',
    credentials: 'include',
    headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `${config.origin}`,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Credentials": true
    }
}