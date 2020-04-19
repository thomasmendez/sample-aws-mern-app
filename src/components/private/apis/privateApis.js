import config from 'config'

export function signup() {
    return `${config.apiUrl}/signup`
}

export function login() {
    return `${config.apiUrl}/login`
}

export function logout() {
    return `${config.apiUrl}/logout`
}

export function usersDirectory() {
    return `${config.apiUrl}/users`
}

export function deleteUser() {
    return `${config.apiUrl}/users/deleteUser`
}