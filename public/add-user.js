/**
 * Name: Ashlyn Roice
 * CS132 Spring 2025
 * Date: June 14, 2025
 * Description: This is the add-center.js file for my web project Ada. This allows users who are 
   admins to add centers to centers.json.
 */
   "use strict";
   (function() {
        /**
        * Initializes all necessary event listeners and functions at the start of the window. 
        * First, ensures that current user is an admin with ensureAdmin(). If they're not, displays 
        * a warning message asking user to log in. Also adds "submit" event listener on form which 
        * prevents default behavior (refresh) and adds user with form information into API database
        * so this new user might be able to use Ada.
        * @param {None}
        * @return {None}
        */
       function init() {
           ensureAdmin();
           qs("#add-form").addEventListener("submit", function(evt) {
               evt.preventDefault();
               submitUser();
           })
       }
   
       /**
        * Displays error on page depending on status. For a 500 error, displays a server error 
        * message. For anything else, displays a general error about the data.
        * @param {err} - Error object or string depicting error
        * @return {None}
        */
       function handleError(err) {
           if (typeof err === "string") {
               qs("#err-msg").textContent = err;
           } 
           else {
               // Students are welcome to improve on this functionality more
               const GENERIC_ERR_MSG =
                   "An error occurred fetching the data.";            
               if (err.status === 500) {
                   qs("#err-msg").textContent = "There was an error with the server, try again"; 
               }
               else {
                   qs("#err-msg").textContent = GENERIC_ERR_MSG;
               }
           }
       }
   
       /**
        * Ensures that current user is an admin user, which means they have the privilege of 
        * manually adding users. Does this by examining storageSession attributes and ensuring
        * "username" attribute is not null. If it is, displays error message requesting user to go 
        * to CONTACT page to request admin access. Otherwise, does nothing and allows the user to 
        * proceed.
        * @param {None}
        * @return {None}
        */
       async function ensureAdmin() {
           let currUser = window.localStorage.username;
           let currAdmins = await fetch('/ada/get-admins');
           checkStatus(currAdmins);
           let allAdmins = await currAdmins.json();
           let listAdmins = allAdmins["admins"];
           let adminIdx = -1;
           for (let i = 0; i < listAdmins.length; i++) {
               if (listAdmins[i] === currUser) {
                   adminIdx = i;
                   break;
               }
           }
           if (adminIdx === -1) {
               qs("#add-form").innerHTML = "";
               handleError("You need to be an admin to access this page. Request admin access in" +
               " CONTACT.")
           }
       }
   
       /**
        * Submits a user to users.json. Takes in username, password, and email so that new user
        * profile can be created. If there's an error, it is handled with the handleError() 
        * function.
        * @param {None}
        * @return {None}
        */
       async function submitUser() {
           const params = new FormData();
           params.append("user-signup", qs("input[name='user-signup']").value);
           params.append("password-signup", qs("input[name='password-signup']").value);
           params.append("email-signup", qs("input[name='email-signup']").value);
           try {
               const res = await fetch("/ada/signup", {
                   method: "POST",
                   body: params
               });
               checkStatus(res);
               qs("#err-msg").textContent = "Successfully added user!";
           }
           catch (e) {
               handleError(e);
           }
       }
   
   init();
   })();