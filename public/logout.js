/**
 * Name: Ashlyn Roice
 * CS132 Spring 2025
 * Date: June 13, 2025
 * Description: This is the logout.js page for my website Ada. It allows the display of a success
 * message if logout succeeded and an error message if it didn't.
 */
 (function() {
    /**
     * Initializes all necessary event listeners and functions. Here, initializes the 
     * logout function. Right when the page loads, the logout function clears localStorage and
     * sessionStorage if the username exists in localStorage. This function is only available
     * to users who are logged in.
     * @param {None}
     * @return {None}
     */
    function init() {
        logoutFunc();
    }

    /**
     * This function is only available to those who are logged in (with a username in 
     * localStorage). It merely removes the username from localStorage and clears 
     * sessionStorage (the users favorites) to log out.
     * @param {None}
     * @return {None}
     */
    function logoutFunc() {
        try {
            window.localStorage.removeItem("username");
            window.sessionStorage.clear();
            const navItems = document.querySelectorAll("nav ul li");
            const loginItem = navItems[navItems.length-4];
            loginItem.classList.remove("hidden");
            qs("#success").textContent = "Logged out succesfully.";
        }
        catch(e) {
            qs("#error").textContent = "Server error, please try again.";
        }

    }
init();
})();