import { saveUser , loadUser , clearUser } from './storage.js'; 

const validUsername = 'admin';
const validPassword = '1234';

export function isLoggedIn() {
    return loadUser() !== null;
}

export function login(username, password) {

    if(username === validUsername && password === validPassword) {
        saveUser({username})
        return true;
    }
    return false;
}

export function logout() {
    clearUser();
}

export function getCurrentUser() {
    return loadUser() || null;
}