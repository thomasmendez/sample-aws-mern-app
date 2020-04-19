import config from 'config'

export function signup() {
    return `${config.apiUrl}/signup`
}

export function login() {
    return `${config.apiUrl}/login`
}

export function resetPassword() {
    return `${config.apiUrl}/resetPassword`
}

export function usersDirectory() {
    return `${config.apiUrl}/`
}