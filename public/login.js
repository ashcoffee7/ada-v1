/**
 * Name: Ashlyn Roice
 * CS132 Spring 2025
 * Date: June 13, 2025
 * Description: This is the login.js page for my web project Ada. It manages the login process for 
 * Ada.
 */

 "use strict";

 (function() {
    /**
         * Given an error, displays it on the console and avoids leaking error messages directly 
         * onto the web page. If there is a 500 error, states that there is a server error. If 
         * there is a 401 error, states that the given username or password is invalid. Otherwise,
         * returns generic error statement.
         * @param {err} - Error to display
         * @return {None}
         */
     function handleError(err){
         qs("#success-msg").textContent = "";
         if (typeof err === "string") {
             qs("#err-msg").textContent = err;
         } 
         else {
             // Students are welcome to improve on this functionality more
             const GENERIC_ERR_MSG =
                 "An error occurred during log in.";            
             if (err.status === 500) {
                 qs("#err-msg").textContent = "There was an error with the server, try again"; 
             }
             else if (err.status === 401) {
                 qs("#err-msg").textContent = "The given username or password is invalid."
             }
             else {
                 qs("#err-msg").textContent = GENERIC_ERR_MSG;
             }
             console.log(err);
         }
     }
 
    /**
         * Ensures that all necessary functions and event listeners are initialized at the 
         * beginning of the program. Here, it initiates a "click" event on .submit-sign button
         * to ensure that when this button is clicked, the username and password of the user is
         * validated.
         * @param {None}
         * @return {None}
         */
     function init() {
         qs(".submit-sign").addEventListener("click", handleUser);
     }
     
     /**
     * Ensures that given a username and password from the user, the site either outputs 
     * whether something went wrong with the server, whether the username/passwod is invalid
     * or missing, or whether the login was successful. If it was successful, then the username
     * is stored to localStorage.
     * @param {None}
     * @return {None}
     */
     async function handleUser() {
         const username = qs("input[name='username-submit']").value;
         const password = qs("input[name='password-submit']").value;
         const successEl = qs("#success-msg");
         if (!username || !password) {
             handleError("Please enter a username and password.");
             return;
         }
         successEl.textContent = "";
         qs("#err-msg").textContent = "";
         let res;
         try {
             res = await fetch('/ada/login',
             {
                 method: 'POST',
                 headers: {"Content-Type": "application/json"},
                 body: JSON.stringify({"username-submit": username, "password-submit": password})
             });
             checkStatus(res);
             const data = await res.json();
             window.localStorage.setItem("username", data.username);
             successEl.textContent = `Login successful! Welcome ${username}`;
             qs("#err-msg").textContent = '';
             qs("input [name='username-submit]").disabled = true;
             const navItems = document.querySelectorAll("nav ul li");
             if (navItems.length >= 3) {
                 navItems[navItems.length - 1].classList.remove("hidden");
                 navItems[navItems.length - 2].classList.remove("hidden");
                 navItems[navItems.length - 3].classList.remove("hidden");
                const loginItem = navItems[navItems.length-4];
                loginItem.classList.add("hidden");
             }
             else {
                 handleError("Something went wrong, please refresh the page and try again");
                 return;
             }
         }
         catch (e) {
            e.status = res.status;
            handleError(e);
            return;
         }
 
     }
 init();
 })();