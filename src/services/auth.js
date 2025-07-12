import { getData } from "./api";
import { userURL } from "../utils/config";

export async function login(email, password){
    const users = await getData(userURL)
    const userFound = users.find(user => user.email === email && user.password === password);
    if(userFound){
        localStorage.setItem("currentUser" , JSON.stringify(userFound));
        return true;
    } else{
        return;
    }
};

export function getCurrentUser(){
    return JSON.parse(localStorage.getItem(`currentUser`));
}

export function logout(){
    localStorage.removeItem(`currentUser`)
}

export function isAdmin(){
    const user = getCurrentUser();
    return user?.role === `admin`;
}