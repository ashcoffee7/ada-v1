/**
 * Name: Ashlyn Roice
 * CS132 Spring 2025
 * Date: June 13, 2025
 * Description: This is the entry.js page for my web project Ada. It manages the population of the
 * FAQ section of entry.html;
 */

 (function() {
    /**
     * Initializes all necessary functions and event listeners when the page loads. Here, ensures 
     * that all questions from FAQ are displayed on the page. Also adds a "submit" event listener to 
     * the questions form and the form to add administrators. These event listeners both prevent 
     * default behaviors. Then, it allows submissions to questions.json and admin-request.json, 
     * respectively.
     * @param {None}
     * @return {None}
    */
    function init() {
        getAllQuestions();
        qs("#question-form").addEventListener("submit", function(evt) {
            evt.preventDefault();
            submitQuestion();
        });
        qs("#admin-form").addEventListener("submit", function(evt) {
            evt.preventDefault();
            submitAdminReq();
        })
    }

    /**
     * Displays all questions on the page according to the questions that are grabbed by the 
     * "/ada/get-questions" endpoint. It fetches the data using FemHealthAPI's /get-questions/ 
     * endpoint. It the creates cards using the data from this endpoint.
     * @param {None}
     * @return {None}
     */
    async function getAllQuestions(){
        try {
            let questions = await fetch("/ada/get-questions");
            checkStatus(questions);
            questions = await questions.json();
            
            // display questions
            for (let i = 0; i < questions.length; i++) {
                let currQuestion = questions[i];

                let currDiv = document.createElement("div");
                qs("#contact-questions").appendChild(currDiv);

                let currQ = document.createElement("p");
                currQ.textContent = currQuestion["question"];
                currQ.classList.add("question-card");
                currDiv.appendChild(currQ);
                
                let currA = document.createElement("p");
                currA.textContent = currQuestion["answer"];
                currA.classList.add("answer-card");
                currDiv.appendChild(currA);
            }
        }
        catch(e) {
            handleError(e);
        }
    }

    /**
     * Connects to the POST request in app.js and works to subit admin requests through the server.
     * Takes in the name and email of the requestor and adds their information to admin-request.js.
     * If there is an error, it is displayed as a server error.
     * @param {None}
     * @return {None}
     */
    async function submitAdminReq() {
         const params = new FormData();
         params.append("name-admin", qs("input[name='name-admin']").value);
         params.append("email-admin", qs("input[name='email-admin']").value);
         try {
             const res = await fetch("/ada/send-admin-req", {
                 method: "POST", 
                 body: params
             });
             checkStatus(res);
             qs("#msg").textContent = "Succesfully submitted admin req!";
         }
         catch(e) {
             e.status = 500;
             handleError(e);
         }
    }

    /**
     * Given an error, displays it on the console and avoids leaking error messages directly 
     * onto the web page. If it is a 500 error, states that there was an error with the server. If 
     * it's a 400 error, states that the given location is invalid.
     * @param {err} - Error to display
     * @return {None}
     */
    function handleError(err){
        if (typeof err === "string") {
            qs("#msg").textContent = err;
        } 
        else {
            // Students are welcome to improve on this functionality more
            const GENERIC_ERR_MSG =
                "An error occurred fetching the data.";            
            if (err.status === 500) {
                qs("#msg").textContent = "There was an error with the server, try again"; 
            }
            else if (err.status === 404) {
                qs("#msg").textContent = "The given location name is invalid."
            }
            else {
                qs("#msg").textContent = GENERIC_ERR_MSG;
            }
        }
    }

    /**
     * Submits the question from the question form to questions.json. Takes in user name, email, 
     * and question and adds these 3 elements to questions.json. This allows the administrators of
     * the website to form a reply and post it within the FAQ.
     * @param {None}
     * @return {None}
     */
    async function submitQuestion() {
        const params = new FormData();
        params.append("name-submit", qs("input[name='name-submit']").value);
        params.append("email-submit", qs("input[name='email-submit']").value);
        params.append("question-submit", qs("input[name='question-submit']").value);
        try {
            const res = await fetch("/ada/send-question", {
                method: "POST", 
                body: params
            });
            checkStatus(res);
            qs("#msg").textContent = "Succesfully submitted question!";
        }
        catch(e) {
            e.status = 500;
            handleError(e);
        }
        
    }

init();
})();