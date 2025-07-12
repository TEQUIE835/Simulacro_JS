import { renderHeader } from "./components/header";
import { userListDashboard } from "./services/users";
import { isAdmin } from "./services/auth";
import { registerUser, userLogin } from "./services/users";
import { coursesListUser } from "./services/courses";
export async function navigate(route) {
    const routes = {
        '/': './src/pages/public.html',
        '/login': './src/pages/login.html',
        '/register': './src/pages/register.html',
        '/dashboard': './src/pages/dashboard.html',
    };

    const path = routes[route];
    const page = document.getElementById("app");
    if (!path) {
        page.innerHTML = "<h2>404 - Página no encontrada</h2>";
        return;
    };
    const response = await fetch(path);
    let html = await response.text();
    page.innerHTML = html;
    history.pushState({}, '', route);
    renderHeader();
    if(route == "/register"){
        registerUser()                                                                                                                                                          
    }
    if(route == "/login"){
        userLogin()
    }
    if(route == "/dashboard"){
        if(!isAdmin()){
            navigate("/")
        }
        userListDashboard();
    }
    if (route == "/"){
        if(isAdmin()){
            navigate("/dashboard")
        }
        coursesListUser()
    }
};



addEventListener(`DOMContentLoaded`,() => {
    navigate(location.pathname);
    document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        const url = e.target.getAttribute("href");
        navigate(url);
    }});
    window.addEventListener('popstate', () => {
        navigate(location.pathname)
    });
});