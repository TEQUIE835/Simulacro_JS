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