import { getCurrentUser, logout } from "../services/auth";
import { navigate } from "../main";
export function renderHeader(){
    const sesion = getCurrentUser();
    const header = document.getElementById(`header`);
    if (!sesion){
        let html = ``
        html += `<div class="public-header"><button id="loginButton" class= "header-btn">Login</button><button id="registerButton" class= "header-btn">Register</button></div>`
        header.innerHTML = html
        document.getElementById(`loginButton`).addEventListener(`click`, (e)=>{
        e.preventDefault();
        navigate(`/login`)
        })
        document.getElementById(`registerButton`).addEventListener(`click`, (e)=>{
            e.preventDefault();
            navigate(`/register`)
        })
    } else{
        let html = ``
        html += `<div class="logged-header"><span class="header-name">Hola, ${sesion.name}</span><button id="logoutButton" class= "header-btn">Logout</button></div`
        header.innerHTML = html
        document.getElementById(`logoutButton`).addEventListener(`click`, (e)=>{
        e.preventDefault();
        logout();
        navigate(`/`);
})
    }
  

}

