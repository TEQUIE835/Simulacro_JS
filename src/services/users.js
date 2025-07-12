import {getData, postData, deleteData, putData} from "./api.js";
import {userURL} from "../utils/config.js";
import { login } from "./auth.js";
import { isAdmin } from "./auth.js";
import { navigate } from "../main.js";
import { giveButtonFunctionalities } from "../components/sidebar.js";
import Swal from "sweetalert2";
 
function generateEnrollNumber(){
    const timestamp = Date.now();
    const random = Math.floor(Math.random()*1000);
    return `${timestamp}${random}`
};

async function uniqueEnrollNumber(){
    const data = await getData(userURL);
    let enrollNumber
    do{
         enrollNumber = generateEnrollNumber();
    } while(data.find(u => u.enrollNumber === enrollNumber));
    return enrollNumber;
};

function actualDate(){
    let options = {month: `short`, day : `2-digit`, year : `numeric`};
    return new Date().toLocaleDateString('en-US', options);
};
export async function registerUser (){
document.getElementById(`registerForm`).addEventListener(`submit`, async (e) => {
    console.log('Creating user')
    e.preventDefault();
    let data = await getData(userURL);
    let id = data.length;
    let email = document.getElementById(`emailNew`).value;
  
    if(data.find(u => u.email == email)){
        console.error(`Email already in use`)
        Swal.fire({
            title : 'Email already in use',
            icon : 'error'
        })
        navigate('/register')
        return;
    }
    do{
        id++;
    }while(data.find(u => u.id == id));
    let body = {
        id : String(id),
        name : document.getElementById(`nameNew`).value,
        email : email,
        password : document.getElementById(`passwordNew`).value,
        role : `user`,
        phone : document.getElementById(`phoneNew`).value,
        enrollNumber : await uniqueEnrollNumber(),
        dateOfAdmission : actualDate()
    };

    let usesrTrue = await postData(userURL, body);
    console.log (usesrTrue)
    if(usesrTrue){
        Swal.fire({
            title : 'User created succesfully',
            icon : 'success'
        })
        console.log('user created')
        navigate(`/login`)

    } else{ console.error(`ocurrio un error`)}

});
}

export async function userLogin(){
    document.getElementById(`loginForm`).addEventListener(`submit`,async (e) => {
    e.preventDefault();
    const email = document.getElementById(`emailLogin`).value;
    const password = document.getElementById(`passwordLogin`).value;
    let ingreso = await login(email, password)
    if (ingreso === true){
        let role = isAdmin()
        if (role === true){
            navigate(`/dashboard`)
        } else if(role === false){
            navigate (`/`)
        }
    } else{
        Swal.fire({
            title: `Error while login`,
            description : `The email or the password are wrong`,
            icon : `error`

        })
    }
})
}

export async function userListDashboard(){
     let listingSection = document.getElementById(`listing`);
        let html = ''
        html = `<table>
        <tr><td>ID</td><td>name</td><td>email</td><td>phone</td><td>enrollNumber</td><td>role</td><td>Edit</td><td>Delete</td></tr>`
        const users = await getData(userURL);
        users.forEach(u => {
            html += `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.phone}</td><td>${u.enrollNumber}</td><td>${u.role}</td><td><button class="admin-btn edit-btn" data-id="${u.id}">✏️</button></td><td><button class="admin-btn delete-btn" data-id="${u.id}">🗑️</button></td></tr>`
        });
        html += `</table>`;
        listingSection.innerHTML = html;
    
    document.querySelectorAll(`.edit-btn`).forEach(btn => {
            btn.addEventListener(`click`, async (e)=>{
            e.preventDefault();
            const id = e.target.dataset.id
            let user = await getData(userURL + `/${id}`)
            const {value: formValues} = await Swal.fire({
                title : `Edit user`,
                html : ` 
                    <input type="text" id="swal-name" class="swal2-input" placeholder="Name" value="${user.name}">
                    <input type="email" id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
                    <input type="number" id="swal-phone" class="swal2-input" placeholder="Phone" value="${user.phone}">
                    <select id="swal-role" class="swal2-input">
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                    </select>`,
                focusConfirm : false,
                showCancelButton : true,
                confirmButtonText : `Save`,
                preConfirm: () => {
                    const name = document.getElementById('swal-name').value;
                    const email = document.getElementById('swal-email').value;
                    const phone = document.getElementById('swal-phone').value;
                    const role = document.getElementById('swal-role').value;

                    if (!name || !email || !phone) {
                        Swal.showValidationMessage('Please fill in all fields');
                        return false;
                    };

                    return { name, email, phone, role };
                    }
        });

            let updatedUser;
            if (formValues){
                updatedUser = {
                    id: String(user.id),
                    name: formValues.name,
                    email: formValues.email,
                    password: user.password,
                    role: formValues.role,
                    phone: formValues.phone,
                    enrollNumber: user.enrollNumber,
                    dateOfAdmission: user.dateOfAdmission
                }
                await putData(userURL, id, updatedUser)
                Swal.fire('Updated!', 'User data has been updated.', 'success');
                
    
            }
            
            userListDashboard();
        });
    });
    document.querySelectorAll(`.delete-btn`).forEach(btn =>{
        btn.addEventListener(`click`, async (e) =>{
            e.preventDefault();
            const id = e.target.dataset.id
            let user = await getData(userURL + `/${id}`)
            if (!user){
                console.error(`User not found`)
                Swal.fire({
                    title : `Error, user not found`,
                    icon : `error`
                })
            } else if (user){
                Swal.fire({
                    title: `Are you sure?`,
                    text : `This action will delete ${user.name} permanently `,
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'Cancel'
                }).then(async (result) => {
                    if (result.isConfirmed){
                        await deleteData(userURL, id)
                        Swal.fire({
                            title: `The user was deleted`,
                            icon : `success`
                        });
                        userListDashboard();
                    }
                })
                
                
            };
        });
    });
    
    giveButtonFunctionalities()
};
