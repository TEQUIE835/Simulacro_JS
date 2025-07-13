import Swal from "sweetalert2";
import { giveButtonFunctionalities, giveUserButtonsFunctionalities } from "../components/sidebar"
import { courseURL, enrollmentURL, userURL } from "../utils/config"
import { deleteData, getData } from "./api"
import { getCurrentUser } from "./auth";
import { navigate } from "../main";


export async function enrollmentsListDashboard(){
    const listingSection = document.getElementById(`listing`);
    const enrollments = await getData(enrollmentURL);
    let html = `<h1 class="title">Enrollments</h1> <div class="courses-container">`
    let user;
    let course;
    for (let enroll of enrollments) {
        user =  await getData(userURL + `/${enroll.userId}`)
        course = await getData(courseURL + `/${enroll.courseId}`) || null
        if(!course || !user){
            await deleteData(enrollmentURL, enroll.id);
            enrollmentsListDashboard();
        }

        html += `<article class = "course-card">
        <span>Enroll ID: ${enroll.id}</span>
        <br> 
        <h2>${course.title}</h2>
        <h3>${user.name}</h3> 
        <button class = "deleteEnroll-btn admin-btn delete-btn" data-id="${enroll.id}">🗑️</button><br></article>`
    };
    html += `</div>`;
    listingSection.innerHTML = html
    document.querySelectorAll(`.deleteEnroll-btn`).forEach(btn => {
        btn.addEventListener(`click`, async (e) => {
            e.preventDefault();
            const id = e.target.dataset.id
             let enroll = await getData(enrollmentURL + `/${id}`)
            
             if (!enroll){
                console.error(`Enroll wasn't found`);
                Swal.fire({
                    title : `Error, enroll wasn't found`,
                    icon : `error`
                });
             } if(enroll){
                Swal.fire({
                    title: `Are you sure?`,
                    text : `This action will delete the enroll with id ${enroll.id} permanently `,
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'Cancel'
                }).then(async (result) => {
                    if (result.isConfirmed){
                        await deleteData(enrollmentURL, id);
                        Swal.fire(`Succes`, `Enroll succesfully deleted`, `error`);
                        enrollmentsListDashboard();
                }});
                
             }
        });
    });

    giveButtonFunctionalities();
}


export async function listUserEnrollments(){
    const listingSection = document.getElementById(`userCourseListing`);
    const user = await getCurrentUser();
    if(!user){
            Swal.fire({
            title : `Opps, seems like you aren't logged`,
            text : `Try login in or registering first`,
            icon : `info`,
            showCancelButton : true,
            cancelButtonColor: `#7066e0`,
            confirmButtonColor : `#7066e0`,
            cancelButtonText : `Register`,
            confirmButtonText : `Login`
        }).then((result) => {
            if (result.isConfirmed){
                navigate(`/login`);
            } else if(result.dismiss === Swal.DismissReason.cancel){
                navigate(`/register`);
            };
        });
        return;
    }
    const enrollments = await getData(enrollmentURL);
    const userEnrolls = [];
    // const userCourses = [];
    for (let enroll of enrollments){
        if (enroll.userId == user.id){
            userEnrolls.push(enroll);
        };
    };
    let html = `<h1 class="title">My courses</h1><div class="courses-container">`;
    for (let enroll of userEnrolls){
        let userCourse = await getData(`${courseURL}/${enroll.courseId}`);
        html += `<article class="course-card">
        <h2>${userCourse.title}</h2>
        <h3>Enroll ID: ${enroll.id}</h3>
        <p>${userCourse.description}</p>
        <span>Date: ${userCourse.startDate}</span><br>
        <span>Duration: ${userCourse.duration}</span><br>
        <button class="cancelCourse-btn cancel-enroll-btn" data-id="${enroll.id}">Cancel</button>
        </article>`;
    }
    html += `</div>`;
    listingSection.innerHTML = html;
    document.querySelectorAll(`.cancelCourse-btn`).forEach(btn => {
        btn.addEventListener(`click`,async (e) => {
            e.preventDefault();
            const id = e.target.dataset.id;
            const enroll = await getData(`${enrollmentURL}/${id}`);
            if(!enroll){
                Swal.fire({
                    title : `Oops`,
                    text : `We couldn't find the course of this enroll`,
                    icon : `error`
                })
            }else if (enroll){
                Swal.fire({
                    title: `Are you sure?`,
                    text : `This action will cancel you're enrollment`,
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'Cancel'
                }).then(async (result) => {
                    if (result.isConfirmed){
                        await deleteData(enrollmentURL, id);
                        Swal.fire({
                            title: `The enroll was deleted`,
                            icon : `success`
                        });
                        listUserEnrollments();
                    };
                });
            };
            
        });
        
    });
    giveUserButtonsFunctionalities();
};