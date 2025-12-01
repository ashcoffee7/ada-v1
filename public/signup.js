/**
 * Name: Ashlyn Roice
 * CS132 Sping 2025
 * Date: June 14, 2025
 * Description: This is the signup.js file for my web project Ada. This allows users to sign up.
 */

 (function() {
    /**
     * Initializes all necessary event listeners and functions. Here, initializes a "submit" event  
     * so that when the #sign-in form is submitted, it can prevent default behavior and run the
     * signUpUser() function, which adds their username and password to the API database.
     * @param {None}
     * @return {None}
     */
    function init() {
        qs("#signin-form").addEventListener("submit", function(evt) {
            evt.preventDefault();
            signUpUser();
        })

    }

     /**
     * Displays error on page depending on status. If there is a 500 error, then it states that 
     * there was a server error. If there is a 404 error, states that the username/password fields
     * are blank. If there is a 406 error, then it states that the username already exists and 
     * another one must be made. 
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
            if (err.status === 404) {
                qs("#err-msg").textContent = "The given username, password, and/or email is blank" +
                " or invalid."
            }
            if (err.status === 406) {
                qs("#err-msg").textContent = "This username already exists, please try another.";
            }
            else {
                qs("#err-msg").textContent = GENERIC_ERR_MSG;
            }
        }
    }

    /**
     * Signs up a user, adding them to the database of users. Takes in a username, password, and 
     * email from the user and passes the information as a payload into the FemHealthAPI endpoint
     * /ada/signup. If the POST request is successful, then the program displays a success message.
     * @param {None}
     * @return {None}
     */
    async function signUpUser() {
        const params = new FormData();
        params.append("user-signup", qs("input[name='user-signin']").value);
        params.append("password-signup", qs("input[name='password-signin']").value);
        params.append("email-signup", qs("input[name='email-signin']").value);
        try {
            const res = await fetch("/ada/signup", {
                method: "POST",
                body: params
            });
            checkStatus(res);
            qs("#err-msg").textContent = "You have successfully signed up! You can now login.";
        }
        catch (e) {
            handleError(e);
        }
    }
init();
})();