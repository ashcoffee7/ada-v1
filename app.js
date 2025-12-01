/**
 * Name: Ashlyn Roice
 * CS132 Spring 2025
 * Date: June 10, 2025
 * Description: JS Code for FemHealthAPI. Controls the extraction of data from center.json.
 */

"use strict";
const http = require("http");
const express = require("express");
const app = express();
const fsp = require('fs/promises');
const PORT = 8081;
const multer = require("multer");
const { resolveNaptr } = require("dns");
const GOOGLE_API_KEY = "AIzaSyC6hJIZLPQ4eBMFv0N_5crsOfHeFfnjngo";

app.use(express.static('public'));
app.use(express.json());
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));

function checkStatus1(response) {
    /**
     * Given a response object, check if it has resolved properly.
     * @param {Respose} - Response object
     * @return {None}
     */
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
}

/**
 * Returns a list of all centers from center.json as a JSON response.
 * Example: 
        {  
            "name": "APLA Health",
            "address": "1127 Wilshire Blvd UNIT 1504, Los Angeles, CA 90017",
            "services": ["Primary care", "Dental", "Behavioral health", "HIV care"],
            "insurances": ["Sliding scale", "Medi-Cal", "L.A. Care", "Health Net", "Molina", "Blue Shield Promise", "Anthem", "Beacon", "MHN", "L.A. Care", "Health Net", "Molina", "Blue Cross", "Blue Shield", "Cigna", "Anthem Blue Cross", "United Healthcare", "Aetna", "My Health LA", "Private insurance", "Brand New Day", "United Healthcare (AARP)", "SCAN", "Humana Medicare"],
            "image-address": "https://aplahealth.org/wp-content/uploads/2022/12/Downtown-Dental-1_1.jpg"
        },
        {
            "name": "Community Resource Centers",
            "address": "4801 Whittier Blvd, East Los Angeles, CA 90022",
            "services": ["Member support", "Health education", "Telehealth access"],
            "insurances": ["L.A. Care Health Plan members (Medi-Cal HMO)"],
            "image-address": "https://images1.loopnet.com/i2/WaRaaN8s3gjJp4pv2K41t36TXTwyq6uWHWGjTxQ0jXU/112/image.jpg"
        }
    Returns a 500 error if there is a server error.
 */
app.get("/ada/all-centers", async (req, res) => {
    try {
        let currFile = await fsp.readFile("center.json", "utf-8");
        res.type("json");
        res.send(currFile);
        
    }
    catch (e) {
        res.status(500);
        res.type("json");
        res.send({"error": "Server error, please try again."});
    }
}
)

/**
     * Helper function to get all current centers in center.json. A wrapper function for 
     * /ada/all-centers. Parses the center.json file and returns the data as the JSON.
     * @param {None}
     * @return {None}
    */
async function getAllCenters() {
    try {
        let currFile = await fsp.readFile("center.json", "utf-8");
        let currJson = JSON.parse(currFile);
        return currJson;
    }
    catch (e) {
        return ({"error": "Server error, please try again."});
    }
}

/**
     * Formats all centers currently in center.json to pass in as an input URL into Google Maps API.
     * Appends each center name to the link, separated by "|" characters. 
     * @param {None}
     * @return {None}
    */
async function formatCentersForSearch() {
    let centers = await getAllCenters();
    let dest = "";
    for (let i = 0; i < centers.length; i++) {
        dest += encodeURIComponent(centers[i].address);
        if (i < centers.length - 1) {
            dest += "|";
        }
    }
    return dest;
}

/**
     * Return the top closest locations based on the reference address provided by the user and
     * the number of locations the user requests to receive. Takes in data from the resulting JSON
     * from Google Maps API and ranks them by distance to address (origin). If an error comes up,
     * it is displayed as an issue with the Google Maps API.
     * @param {googleMapsData} - data from Google Maps API on distances between each center and 
       given address
     * @param {num} - the number of locations the user wants to see
     * @return {json Object} - the JSON entries for the top 5 centers closest to the given address.
*/
async function topLoc(googleMapsData, num) {
    let centerDist = [];
    try {
        let centers = await getAllCenters();
        for (let i = 0; i < centers.length; i++) {
            const el = googleMapsData.rows[0].elements[i];
            centerDist.push({"name": centers[i].name,
                "address": centers[i].address,
                "distanceValue": el.distance.text,
                "image-address": centers[i]["image-address"]
            });
        }
        for (let i = 0; i < centerDist.length; i++) {
            let minIndex = i;
            for (let j = i + 1; j < centerDist.length; j++) {
                if (centerDist[j].distanceValue < centerDist[minIndex].distanceValue) {
                    minIndex = j;
                }
            }
            const temp = centerDist[i];
            centerDist[i] = centerDist[minIndex];
            centerDist[minIndex] = temp;
        }
        return (centerDist.slice(0,num));
    }
    catch (e) {
        return ({"error": "There was a problem sorting all location data, try again."});
    } 
}

/**
 * Returns the top x locations closest to the user-given address. x is defined by the user.
 * Example Output:
 * [
  {
    "name": "Via Care Community Health Center",
    "address": "284 S Atlantic Blvd, Los Angeles, CA 90022",
    "distanceValue": "3,573 km",
    "image-address": "https://s3-media0.fl.yelpcdn.com/bphoto/0_18wXtqVuRiu3_FRgIOPw/348s.jpg"
  },
  {
    "name": "Community Resource Centers",
    "address": "4801 Whittier Blvd, East Los Angeles, CA 90022",
    "distanceValue": "3,576 km",
    "image-address": "https://images1.loopnet.com/i2/WaRaaN8s3gjJp4pv2K41t36TXTwyq6uWHWGjTxQ0jXU/112/image.jpg"
  },
  {
    "name": "APLA Health",
    "address": "1127 Wilshire Blvd UNIT 1504, Los Angeles, CA 90017",
    "distanceValue": "3,583 km",
    "image-address": "https://aplahealth.org/wp-content/uploads/2022/12/Downtown-Dental-1_1.jpg"
  }
]
 * Returns a 400 error if no origin is given by the user. Returns a 500 error if there is a server
 * issue.
 */
app.get("/ada/top-loc", async (req, res) => {
    // get address
    res.type("json");
    let origin = req.query.address;
    let num = req.query.num;
    if (!origin) {
        return res.status(400).json({"error": "Address is required for this filter."});
    }
    const allCentersLink = await formatCentersForSearch();
    const googleFetchUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${allCentersLink}&key=${GOOGLE_API_KEY}`;
    try {
        let response = await fetch(googleFetchUrl);
        checkStatus1(response);
        let data = await response.json();
        // check if data is a valid json. sometimes status.ok returned even with invalid/empty
        const element = data.rows[0].elements;
        for (let i = 0; i < element.length; i++) {
            if (element[i].status === "NOT_FOUND") {
                res.status(404);
                res.send({error: "Invalid address provided, please try again."});
                return;
            }
        }
        let final = await topLoc(data, num);
        res.send(JSON.stringify(final, null, 2));
    }
    catch (e) {
        res.status(500);
        res.send({"error": "There was a server issue, check your address and try again."});
    }
}
);

/**
 * Returns information about a center chosen by the user.
 * Example output: 
 * {
  "name": "Tia",
  "address": "8500 W Sunset Blvd Suite 103, West Hollywood, CA 90069",
  "services": [
    "Primary care",
    "Gynecological health",
    "Sexual health",
    "Mental health",
    "Acupuncture",
    "Skin care"
  ],
  "insurances": [
    "Aetna",
    "Anthem",
    "Blue Shield of California",
    "Cigna",
    "UnitedHealthcare",
    "Call for more information"
  ],
  "image-address": "https://cdn.sanity.io/images/8qqycr4y/production/9eab674d81a53e2249b1f4e7c01932efef86cda6-2000x1400.jpg?w=768&h=538&fit=crop"
}
 * Returns a 400 error if on center name is provided or if a user-given center's information is not 
 * available. Returns a 500 error if there is a server error.
 */
app.get("/ada/center-info", async (req, res) => {
    // get current name 
    let name = req.query.name;
    if (!name) {
        res.status(400)
        res.type("json");
        res.send({"error": "You must provide the name of a center."});
    }

    // get info for that center. also has error handling for if it isn't in json
    try {
        let allCenters = await getAllCenters();
        let centerInfo = null;
        for (let item of allCenters) {
            if (item.name === name) {
                centerInfo = item;
            }
        }
        if (centerInfo === null) {
            res.status(400);
            res.type("json");
            res.send({"error": "This center's information is not available, please try" +
                    "another center."});
    } 

        else {
            // format info 
            // new card
            res.type("json");
            res.send(JSON.stringify(centerInfo, null, 2));
        }
    }
    catch (e) {
        res.status(500);
        res.type("json");
        res.send({"error": "Server error, please try again."});
    }
});

/**
 * Sends a user's name and email to admin-request.json to signify a person who made a request for
 * admin access to Ada.
 * Required POST parameters: name and email.
 * Optional POST parameters: none.
 * Response type: JSON.
 * Returns a 400 error if a field is left blank. Returns a 500 error for a server issue.
 */
app.post("/ada/send-admin-req", async (req, res) => {
    try {
        let newAdmin;
        try {
            newAdmin = {
                "name": req.body["name-admin"],
                "email": req.body["email-admin"]
            };
            if (!newAdmin["name"] || !newAdmin["email"]) {
                res.status(400);
                res.type("json");
                res.send({"error": "No field can be left blank, please try again."});
                return;
            }
        }
        catch (e) {
            res.status(400);
            res.type("json");
            res.send({"error": "Please ensure all fields are filled out."});
        }
        let adminReqs = [];
        const data = await fsp.readFile("admin-request.json", "utf-8");
        adminReqs = JSON.parse(data);
        adminReqs.push(newAdmin);
        await fsp.writeFile("admin-request.json", JSON.stringify(adminReqs, null, 2), "utf-8");
        res.type("json");
        res.send({"Success": "Sent admin request!"});
    }
    catch (e) {
        res.status(500);
        res.type("json");
        res.send({"error": "Server error, please try again later."});
    }
})

/**
 * Send's a user's name, email, and question to questions.json so that they might be answered and 
 * added to the FAQ.
 * Required POST parameters: name, email, question.
 * Optional POST parameters: none.
 * Response type: JSON.
 * Returns a 500 error if there is a server error.
 */
app.post("/ada/send-question", async (req, res) => {
        let newQ;
        try {
            newQ = {
                "name": req.body["name-submit"],
                "email": req.body["email-submit"],
                "question": req.body["question-submit"]
            };
        let adminReqs = [];
        const data = await fsp.readFile("questions.json", "utf-8");
        adminReqs = JSON.parse(data);
        adminReqs.push(newQ);
        await fsp.writeFile("questions.json", JSON.stringify(adminReqs, null, 2), "utf-8");
        res.type("json");
        res.send({"Success": "Sent question!"});
    }
    catch (e) {
        res.status(500);
        res.type("json");
        res.send({"error": "Server error, please try again later."});
    }
})

/**
 * Grabs all questions in questions.json in JSON format for the client to see.
 * Example Output:
 * [
  {
    "question": "When will there be more centers added to Ada's search database?",
    "answer": "We are adding more centers to Ada every day! If you have a center you'd like us to add, please send us a question through our Questions form below with the name of the center."
  },
  {
    "question": "Which states are represented by Ada right now?",
    "answer": "Right now we are working on expanding throughout California. Please let us know if you'd like to see your state on here!"
  },
  {
    "question": "How does Ada handle updates to insurances being taken or services being offered?",
    "answer": "Ada has a dedicated team that monitors our various centers and contacts for any changes. If there's any outdated information, please let us know!"
  },
  {
    "question": "How can we contribute to ensue Ada's operations continue?",
    "answer": "We always need more fact finders and data checkers! If you'd like to join Ada's team, contact us."
  },
  {
    "question": "I'm having trouble loading the Ada website on my phone.",
    "answer": "Ada is currently only built to optimize on a laptop-based display, but we're working on adding phone-compatible displays as well!"
  }]
  * Returns a 500 error if there is an error with the server.
 */
app.get("/ada/get-questions", async (req, res) => {
    try {
        let allQuestions = await fsp.readFile("questions.json", "utf-8");
        res.type("json");
        res.send(allQuestions);
    }
    catch (e) {
        res.type("json");
        res.status(500);
        res.send({"error": "There was an error with the server, please try again later."});
    }
})

/**
 * Takes in a person's entered username and password and validates their credentials using 
 * users.json.
 * Required POST parameters: username, password.
 * Optional POST parameters: none.
 * Response type: text.
 * Returns a 400 error if either field is blank. Returns a 401 error if the username doesn't exist/
 * doesn't match the password. Returns a 500 error if there was an error with the server.
 */
app.post('/ada/login', async (req, res) => {
    const username = req.body["username-submit"];
    const password = req.body["password-submit"];
    res.type("json");
    if (!username || !password || username === null || password === null) {
        res.status(400);
        res.send({"error": "You must enter some username or password."});
        return;
    }

    try {
        const data = await fsp.readFile("users.json", "utf8");
        const users = JSON.parse(data);
        let user = null;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username && users[i].password === password) {
                user = users[i];
                break;
            }
        }
        if (user) {
            res.send({"success": true, "username": username});
            return;
        }
        else {
            res.status(401);
            res.send({"success": false, "error": "Invalid credentials."});
            return;
        }
    }
    catch (e) {
        res.status(500);
        res.send({"error": "There was an error with the server."});
    }
})

/**
 * Returns a list of all users with admin access to Ada.
 * Example Output: {"admins":["ashroice"]}
 * Returns a 500 error if there is a server error.
 */
app.get('/ada/get-admins', async (req, res) => {
    res.type("json");
    let currUsers;
    try {
        currUsers = await fsp.readFile("users.json");
        currUsers = await JSON.parse(currUsers);
        let allAdmins = [];
        for (let i = 0; i < currUsers.length; i++) {
            if (currUsers[i]["is-admin"] === "true") {
                allAdmins.push(currUsers[i]["username"]);
            }
        };
        res.send({"admins": allAdmins});
    }
    catch(e) {
        res.status(500);
        res.send({"error": "Something went wrong, please try again."});
    }
})

/**
 * Adds a username and password given by a new user to users.json to validate credentials in the
 * future (for log-in).
 * Required POST parameters: username, password, email.
 * Optional POST parameters: none.
 * Response type: text.
 * Returns a 400 error if any field is left blank. Returns a 406 error if a user with the entered
 * username already exists. Returns a 500 error if there is a server error.
 */
app.post("/ada/signup", async (req, res) => {
    let newUser;
    try {
        newUser = {
            "username": req.body["user-signup"],
            "password": req.body["password-signup"],
            "email": req.body["email-signup"]
        };
        if (!newUser || !newUser.username || !newUser.password || !newUser.email) {
            res.status(400);
            res.type("json");
            res.send({"error": "All fields must be filled out, please try again."});
            return;
        }
        let newUsers = [];
        const data = await fsp.readFile("users.json", "utf8");
        newUsers = JSON.parse(data);
        let allUsernames = [];
        for (let i = 0; i < newUsers.length; i++) {
            allUsernames.push(newUsers[i]["username"]);
        }
        let currIdx = allUsernames.indexOf(newUser["username"]);
        if (currIdx === -1) {
            newUsers.push(newUser);
            await fsp.writeFile("users.json", JSON.stringify(newUsers, null, 2));
            res.type("json");
            res.send({"success": "Signed up successfully! Please log in."});
        }
        else {
            res.status(406);
            res.type("json");
            res.send({"error": "A user with that username already exists. Try another username."});
            return;
        }
    }
    catch (e) {
        res.status(500);
        res.type("json");
        res.send({"error": "Server error, please try again."});
    }
    }
)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

