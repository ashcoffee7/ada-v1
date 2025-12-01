/**
 * This is the favorites.js file for my web project Ada. This JS file helps to display all centers 
 * in sessionStorage. 
*/

"use strict";

(function () {
    /**
     * Initializes all necessary event listeners and functions at the beginning of the program. 
     * First, ensures that the information summary cards for all favorited centers are displayed. 
     * Then, it also color codes each of the buttons for each of the centers depending on whether 
     * the center has been favorited or not.
     */
    function init() {
        displayAllFavorites();
        window.addEventListener("load", checkFavorites);
    }
    
    /**
     * Given an error, displays it on the console and avoids leaking error messages directly 
     * onto the web page. If it's a 400 error, states that the given location is invalid. If it's a 
     * 500 error, states that there was a server error. Otherwise, provides a generic error 
     * message.
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
            else if (err.status === 400) {
                qs("#err-msg").textContent = "The given location name is invalid."
            }
            else {
                qs("#err-msg").textContent = GENERIC_ERR_MSG;
            }
        }
    }
    
    /**
     * Helper function to format the information for each center's card. This is specifically
     * for the summary version of the information cards, displayed when LOCATION
     * FINDER is pressed. Grabs the center data from FemHealthAPI and displays the center name and 
     * address.
     * @param {currDiv} - the current div to append all new elements to
     * @param {item} - the center that is being displayed and its information in JSON format
     * @return {currDiv} - the currDiv that was passed as a parameter with all new items
     * appended to it 
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
     * Displays all centers that are favorited if they're a user. Grabs all favorite centers from
     * the localStorage and then matches their center name with the center names within the 
     * database. If there is a match, returns a card of information. Otherwise, displays an error.
     * @param {None}
     * @return {None}
    */
    async function displayAllFavorites() {
        qs("#favorite-cards").innerHTML = "";
        if (!window.localStorage.getItem("username")) {
            handleError("You need to be logged in to view your favorites.");
            return;
        }
        let allCenters;
        try {
            allCenters = await fetch('/ada/all-centers');
            checkStatus(allCenters);
            allCenters = await allCenters.json();
        }
        catch (e) {
            e.status = 500;
            handleError(e);
        }
        let allFavs = JSON.parse(window.sessionStorage.getItem('favorite-centers'));
        if (!allFavs || allFavs.length === 0) {
            handleError("You don't have any favorites yet! Go make some :)")
            return;
        }
        for (let i = 0; i < allFavs.length; i++) {
            let item;
            for (let j = 0; j < allCenters.length; j++) {
                if (allCenters[j].name === allFavs[i]["center"]) {
                    item = allCenters[j];
                    break;
                }
            }    
            // create new div to house info
            let currDiv = document.createElement("button");
            currDiv.classList.add("favorited-card");
            
            currDiv = createCard(currDiv, item);

            // append to body
            qs("#favorite-cards").appendChild(currDiv);
        }
        
    }

    /**
     * Toggles "favorite" button. With every press of the button, the favorite button switches
     * between the "favorited" (toggled) class and not having the "favorited" class. This 
     * also allows for the facilitation of the removal and addition of new favorites to
     * sessionStorage.
     * @param {ctr} - the center name associated with the favorite button
     * @param {button} - the favorite button in question, which is having this toggle function
     * being applied on it
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
            // find parent div .favorited-card
            let currParent = button.parentElement.parentElement;
            if (currParent) {
                currParent.remove();
            }
        }
        window.sessionStorage.setItem("favorite-centers", JSON.stringify(currFavs, null, 2));
    }

    /**
     * Every time the page refreshes, ensures that all favorites are styled using the 
     * .favorited CSS styles (and vice versa), indicating persistent storage of favorites. If there
     * are not favorites, then nothing is styled.
     * @param {None}
     * @return {None}
     */
    function checkFavorites() {
        if (!window.sessionStorage["favorite-centers"]) {
            return;
        }
        const buttons = qsa(".center-header button");

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add("favorited");
        }
    }
        
    
    
init();    
})();