/**
 * This is the product.js file for my web project Ada. This JS file helps to display all centers in 
 * center.json (will be connected to MongoDB in the near future) and filter for service and closest
 * center. Future iterations will also add for filtering by user-added tags (e.g. LGBTQ+ 
 * affirming, etc.)
*/

"use strict";

(function () {
    /**
     * Initializes all events and functions when the page loads. First, ensures that all cards for
     * each center are displayed on the page. a
     */
    function init() {
        displayAll();
        qs(".submit-location").addEventListener("click", returnTopLocs);
        window.addEventListener("load", checkFavorites);
    }
    
    /**
     * Given an error, displays it on the console and avoids leaking error messages directly 
     * onto the web page. If it's a 500 error, it's a server error. If it is a 404 error, it is
     * displayed as an error caused by the user-given location. If the status code is either 
     * 404 or 500, displays a generic error.
     * @param {err} - Error to display
     * @return {None}
     */
    function handleError(err){
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
            else if (err.status === 404) {
                qs("#err-msg").textContent = "The given location name is invalid."
            }
            else {
                qs("#err-msg").textContent = GENERIC_ERR_MSG;
            }
        }
    }
    
    /**
     * Helper function for creating information card for each center. Uses div to append to and
     * JSON information for each center to format information for every center. 
     * @param {currDiv} - the div to append the the information card to
     * @param {item} - the JSON of information corresponding to that center 
     * @returns 
     */
    function createCard(currDiv, item) {
        // create object for img
        let currImg = document.createElement("img");
        currImg.src = item["image-address"];
        currImg.alt = "Image of " + item["name"];
        currDiv.appendChild(currImg);

        // create object which holds name and heart button
        let currHeader = document.createElement("div");
        currHeader.classList.add("center-header");

        let currHeaderButton = document.createElement("button");
        currHeaderButton.textContent = "Like";
        currHeader.appendChild(currHeaderButton);

        let currName = document.createElement("p");
        currName.textContent = item["name"];
        currName.classList.add("center-name");
        currName.addEventListener("click", () => {
            window.location.href = `entry.html?name=${encodeURIComponent(item["name"])}`;
        })
        currHeader.appendChild(currName);
        currHeaderButton.addEventListener("click", () => {
            toggleFavorite(currName.textContent, currHeaderButton);
        });
        currDiv.append(currHeader); 

        let currLoc = document.createElement("p");
                currLoc.textContent = item["address"];
                currDiv.appendChild(currLoc);

        return currDiv;
    }
    
    /**
     * Displays all center addresses available to user (as a summary). Creates a information card
     * summary for each center and appends it to the div.
     * @param {None}
     * @return {None}
    */
    async function displayAll() {
        try {
            let centers = await fetch("/ada/all-centers");
            checkStatus(centers);
            centers = await centers.json();
            
            // set up each card
            for (let i = 0; i < centers.length; i++) {
                const item = centers[i];
    
                // create new div to house info
                let currDiv = document.createElement("div");
                currDiv.classList.add("summary-card");
                
                currDiv = createCard(currDiv, item);
    
                // append to body
                qs("#location-cards").appendChild(currDiv);
            }
        }
        catch (e) {
            handleError(e);
        }
    }

    /**
     * Returns the top locations closest to the user using the FemHealthAPI /ada/top-loc endpoint. 
     * Takes the locations returned by the API and formats them into cards using the helper 
     * function createCard. If no number is returned by the user, this function displays the top 3
     * closest locations.
     */
    async function returnTopLocs() {
        const address = qs("#location-finder").value;
        const num = qs("#slider").value;
        if (!address) {
            handleError("You must provide an origin.");
        }
        else if (!num) {
            num = 3;
        }
        else {
            qs("#location-cards").innerHTML = "";
            try {
                let res = 
                    await fetch(`/ada/top-loc?address=${encodeURIComponent(address)}&num=${num}`);
                checkStatus(res);
                let result = await res.json();
                // display all results
                for (let i = 0; i < result.length; i++) {
                    const item = result[i];
        
                    // create new div to house info
                    let currDiv = document.createElement("div");
                    currDiv.classList.add("summary-card");
    
                    currDiv = createCard(currDiv, item);
        
                    // append to body
                    qs("#location-cards").appendChild(currDiv);
                    qs("#err-msg").textContent = "";
                }
            }
            catch (e) {
                handleError(e);
            }
        }
    }

    /**
     * This function toggles the styling and the addition/removal of favorites from sessionStorage. 
     * It first checks if the user is signed in by checking if there is a username in localStorage.
     * If there's nothing in sessionStorage for favorites, it doesn't stylize anything.
     */
    function toggleFavorite(ctr, button) {
        if (!window.localStorage.getItem("username")) {
            handleError("You must be logged in to save favorites.");
            return;
        }
        let currFavs;
        if (window.sessionStorage["favorite-centers"]) {
            currFavs = JSON.parse(window.sessionStorage["favorite-centers"]);
        }
        else {
            currFavs = [];
        }
        let favIdx = -1;
        for (let i = 0; i < currFavs.length; i++) {
            if (currFavs[i].center === ctr) {
                favIdx = i;
                break;
            }
        }
        if (favIdx === -1) {
            currFavs.push({"center": ctr});
            button.classList.add("favorited");

        }
        else {
            currFavs.splice(favIdx, 1);
            button.classList.remove("favorited");
        }
        window.sessionStorage.setItem("favorite-centers", JSON.stringify(currFavs, null, 2));
    }

    function checkFavorites() {
        if (!window.sessionStorage["favorite-centers"]) {
            return;
        }
        const currFavs = JSON.parse(window.sessionStorage["favorite-centers"]);
        const buttons = qsa(".center-header button");

        for (let i = 0; i < buttons.length; i++) {
            let currButtonParent = buttons[i].parentElement.querySelector(".center-name").textContent;
            for (let j = 0; j < currFavs.length; j++) {
                if (currButtonParent === currFavs[j].center) {
                    buttons[i].classList.add("favorited");
                    break;
                }
            }
        }
    }
    
init();    
})();