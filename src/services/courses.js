import { deleteData, getData, putData, postData } from "../services/api";
import { courseURL, enrollmentURL} from "../utils/config";
import { giveButtonFunctionalities, giveUserButtonsFunctionalities } from "../components/sidebar";
import Swal from "sweetalert2";
import { getCurrentUser } from "./auth";
import { navigate } from "../main";

export async function coursesListDashboard(){
    let listingSection = document.getElementById(`listing`);
    let courses = await getData(courseURL);
    let html = `<h1>Courses</h1> <button id="addCourse"> ➕ Add</button>` 
    courses.forEach(course =>{
        html += `<article>
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <span>Course ID: ${course.id}</span><br>
        <span>Start Date: ${course.startDate}</span><br>
        <span>Duration: ${course.duration}</span><br>
        <button class="editCourse-btn" data-id="${course.id}">Edit</button>
        <button class="deleteCourse-btn" data-id="${course.id}">Delete</button>
        </article>`
    });
    listingSection.innerHTML = html
    document.getElementById(`addCourse`).addEventListener(`click`,async (e) =>{
        e.preventDefault();
        let id = courses.length;
        do{
            id++;
        }while(courses.find(c => c.id == id));
        const {value : formValues} = await Swal.fire({
            title : `Add course`,
            html : `<input type ="text" id="courseTitle" class="swal2-input" placeholder ="Name">
            <input type ="text" id="courseDescription" class="swal2-input" placeholder ="Description">
            <input type ="date" id="courseStartDate" class="swal2-input" placeholder ="Start Date">
            <input type ="text" id="courseDuration" class="swal2-input" placeholder ="Duration">`,
            focusConfirm : false,
            showCancelButton : true,
            confirmButtonText : `Save`,
            preConfirm : () => {
                const title = document.getElementById(`courseTitle`).value;
                const description = document.getElementById(`courseDescription`).value;
                const startDate = document.getElementById(`courseStartDate`).value;
                const duration = document.getElementById(`courseDuration`).value;
                if (!title || !description || !startDate || !duration){
                    Swal.showValidationMessage('Please fill in all fields');
                    return false;
                }
                return {title, description, startDate, duration};
            }
        });
        let newCourse;
        if (formValues){
            newCourse = {
                id : String(id),
                title : formValues.title,
                description : formValues.description,
                startDate : formValues.startDate,
                duration : formValues.duration
            };
        };

        await postData(courseURL, newCourse)
        Swal.fire('Added!', 'Course has been added', 'success');
        coursesListDashboard();
    });
    document.querySelectorAll(`.editCourse-btn`).forEach(btn => {
        btn.addEventListener(`click`, async(e) => {
            e.preventDefault();
            let id = e.target.dataset.id
            let course = await getData(courseURL + `/${id}`)
            const {value : formValues} = await Swal.fire({
            title : `Edit course`,
            html : `<input type ="text" id="courseTitle" class="swal2-input" placeholder ="Name" value="${course.title}">
            <input type ="text" id="courseDescription" class="swal2-input" placeholder ="Description" value="${course.description}">
            <input type ="date" id="courseStartDate" class="swal2-input" placeholder ="Start Date" value="${course.startDate}">
            <input type ="text" id="courseDuration" class="swal2-input" placeholder ="Duration" value="${course.duration}">`,
            focusConfirm : false,
            showCancelButton : true,
            confirmButtonText : `Save`,
            preConfirm : () => {
                const title = document.getElementById(`courseTitle`).value;
                const description = document.getElementById(`courseDescription`).value;
                const startDate = document.getElementById(`courseStartDate`).value;
                const duration = document.getElementById(`courseDuration`).value;
                if (!title || !description || !startDate || !duration){
                    Swal.showValidationMessage('Please fill in all fields');
                    return false;
                }
                return {title, description, startDate, duration};
            }
        })
        let updatedCourse;
        if (formValues){
            updatedCourse = {
                id : String(id),
                title : formValues.title,
                description : formValues.description,
                startDate : formValues.startDate,
                duration : formValues.duration
            };
            await putData(courseURL, id, updatedCourse)
            Swal.fire('Updated!', 'Course data has been updated.', 'success');
            
        };
        coursesListDashboard();
        
    })
    })
    document.querySelectorAll(`.deleteCourse-btn`).forEach(btn => {
        btn.addEventListener(`click`, async (e) => {
            e.preventDefault()
            let id = e.target.dataset.id
            let course = getData(courseURL + `/${id}`)
            if (!course){
                console.error(`Course not found`);
                Swal.fire({
                    title : `Error, Course not found`,
                    icon : `error`
                });
            } else if (course){
                Swal.fire({
                    title: `Are you sure?`,
                    text : `This action will delete ${course.title} permanently `,
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'Cancel'
                }).then(async (result) => {
                    if (result.isConfirmed){
                        await deleteData(courseURL, id);
                        Swal.fire({
                            title: `The course was deleted`,
                            icon : `success`
                        });
                        coursesListDashboard();
                    }
                })
                
                
                
            };
            
        });
    });
    giveButtonFunctionalities();
}


export async function coursesListUser(){
    const listingSection = document.getElementById(`userCourseListing`);
    const courses = await getData(courseURL);
    let html = `<h1>Courses</h1>`;
    
    for (let course of courses){
        html += `<article>
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <span>Date: ${course.startDate}</span><br>
        <span>Duration: ${course.duration}</span><br>
        <button class="enroll-btn" data-id="${course.id}">Enroll</button>
    </article>`;
    };
    listingSection.innerHTML = html;
    document.querySelectorAll(`.enroll-btn`).forEach(btn => {
        btn.addEventListener(`click`, async (e) => {
            e.preventDefault();
            const courseId = e.target.dataset.id;
            const user = await getCurrentUser();
            const course = await getData(`${courseURL}/${courseId}`);
            if (!user){
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
                    } else if(result.isDenied){
                        navigate(`/register`);
                    };
                });
            } else if(!course){
                console.error(`We couln't find the course`);
                Swal.fire({
                    title : `Oops`,
                    text : `We couldn't find the course you're trying to enroll`,
                    icon : `error`
                });
                return;
            };
            let enrollments = await getData(enrollmentURL);
            let enrollId = enrollments.length;
            do{
                enrollId++;
            }while(enrollments.find(enroll => enroll.id == enrollId));
            const body = {
                id : String(enrollId),
                userId : user.id,
                courseId : course.id
            };
            let added = await postData(enrollmentURL, body);
            if (!added){
                Swal.fire({
                    title: `Oops`,
                    text: `We couldn't enroll you in the course`,
                    icon : `error`
                });
            } else if(added){
                Swal.fire({
                    title : `Ready`,
                    text : `You're enrollment was succesfull`,
                    icon: `success`
                });
            };
        });
    });
    giveUserButtonsFunctionalities();
};