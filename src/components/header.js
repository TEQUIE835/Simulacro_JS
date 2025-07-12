import { getCurrentUser, logout } from "../services/auth";
import { navigate } from "../main";
export function renderHeader(){
    const sesion = getCurrentUser();
    const header = document.getElementById(`header`);
    if (!sesion){
        let html = ``
        html += `<button id="loginButton" class= "header-btn">Login</button><button id="registerButton" class= "header-btn">Register</button>`
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
        html += `<span>Hola, ${sesion.name}</span><button id="logoutButton">Logout</button>`
        header.innerHTML = html
        document.getElementById(`logoutButton`).addEventListener(`click`, (e)=>{
        e.preventDefault();
        logout();
        navigate(`/`);
})
    }
  

}

