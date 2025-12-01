/**
 * Name: Ashlyn Roice
 * CS132 Spring 2025
 * Date: June 13, 2025
 * Description: This is the all.js file for my web project Ada. It essentially ensures that the 
 * FAVORITES and LOGOUT pages are only available when a user is signed in (when there's a username 
 * in sessionStorage). 
 */

(function() {
    /**
     * Initializes all necessary functions and event listeners when the page loads. Here, the 
     * function setsHeaders() is called every time the window loads to ensure that the correct 
     * links are being displayed in the navbar.
     * @param {None}
     * @return {None}
    */
    function init() {
        setsHeaders();
    }

    /**
     * Sets the header #nav-bar depending on whether the user is logged in or not. If they are,
         then they can access the LOGOUT, ADD USER, and FAVORITES tabs. Runs every time the window
        loads keeping consistency throughout tabs.
        * @param {None}
        * @return {None}
        */
    function setsHeaders() {
        if (window.localStorage.getItem("username")) {
            const navHidden = document.querySelectorAll("nav ul li");
            console.log(navHidden);
            navHidden[navHidden.length - 1].classList.remove("hidden");
            navHidden[navHidden.length - 2].classList.remove("hidden");
            navHidden[navHidden.length - 3].classList.remove("hidden");
            navHidden[navHidden.length - 4].classList.add("hidden");
        }
    }
init();
})()