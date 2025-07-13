import { coursesListDashboard, coursesListUser } from "../services/courses";
import { userListDashboard } from "../services/users";
import { enrollmentsListDashboard, listUserEnrollments } from "../services/enrollment";




export function giveButtonFunctionalities(){
    document.getElementById(`showUsers`).addEventListener(`click`,async (e) => {
        e.preventDefault();
        userListDashboard()
       
    });
    document.getElementById(`showCourses`).addEventListener(`click`, async (e) => {
        e.preventDefault()
        coursesListDashboard()
    });
    document.getElementById(`showEnrollments`).addEventListener(`click`, (e) => {
        e.preventDefault();
        enrollmentsListDashboard()
    })
}


export function giveUserButtonsFunctionalities(){
    document.getElementById(`showCourses`).addEventListener(`click`, (e) => {
        e.preventDefault();
        coursesListUser();
    });

    document.getElementById(`showUserEnrollments`).addEventListener(`click`, (e) => {
        e.preventDefault();
        listUserEnrollments();
    })
}

export function asignSidebarFunctions(){

  const hamburger = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!hamburger || !sidebar) return;

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });

  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  });
}
