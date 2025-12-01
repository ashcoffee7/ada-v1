/**
 * Name: Ashlyn Roice
 * CS132 Spring 2025
 * Date: June 11, 2025
 * Description: This is the entry.js page of my web project Ada. It fills entry.html with 
 * cards of information for individual centers.
*/

"use strict";
(function() {
    /**
     * Given an error, displays it on the console and avoids leaking error messages directly 
     * onto the web page. If there's a 
     * @param {err} - Error to display
     * @return {None}
     */
    function handleError(err){
        if (typeof err === "string") {
            qs("#center-cards").textContent = err;
        } 
        else {
            // Students are welcome to improve on this functionality more
            const GENERIC_ERR_MSG =
                "An error occurred fetching the data.";            if (err.status === 500) {
                qs("#center-cards").textContent = "There was an error with the server, try again"; 
            }
            else if (err.status === 404) {
                qs("#center-cards").textContent = "The given location name is invalid."
            }
            else {
                qs("#center-cards").textContent = GENERIC_ERR_MSG;
            }
        }
    }

    /**
     * When the page is called, this function initializes all needed functions and event 
     * listeners. Here, it ensures that the card for the current center is displayed with all of 
     * its information formatted correctly.
     * @param {None}
     * @return {None}
     */
    function init() {
        fillCards();
    }

    /**
     * Given the query parameter "name", creates and displays a card of information for the 
     * center with that name. It takes in the name of the center and grabs its information from 
     * FemHealthAPI. It then displays this JSON of information by going through each element
     * within the center JSON data.
     * @param {None}
     * @return {None}
    */
    async function fillCards() {
        // gets name
        let params = new URLSearchParams(window.location.search);
        let name = params.get("name");
        if (!name) {
            handleError("You need to provide a name to the query, try again");
        }
        try {

            let info = await fetch(`/ada/center-info?name=${encodeURIComponent(name)}`);
            checkStatus(info);
            let entry = await info.json();
            // make entries for each piece of information
            let currImg = document.createElement("img");
            currImg.src = entry["image-address"];
            currImg.alt = "Picture of " + entry.name;
            qs("#center-cards").appendChild(currImg);

            // make div
            let currDiv = document.createElement("div");
            currDiv.classList.add("info-card");
            qs("#center-cards").appendChild(currDiv);

            // back button
            let currBack = document.createElement("button");
            currBack.addEventListener("click", () => {
                window.location.href = "product.html";
            });
            currBack.textContent = "Back to all centers";
            currDiv.append(currBack);

            let currTitle = document.createElement("p");
            currTitle.textContent = entry.name;
            currTitle.classList.add('fake-heading');
            currDiv.appendChild(currTitle);

            let currAddress = document.createElement("p");
            currAddress.textContent = entry.address;
            currDiv.appendChild(currAddress);

            let currServicesHeading = document.createElement("p");
            currServicesHeading.textContent = "Services Offered: ";
            currServicesHeading.classList.add('fake-heading');
            currDiv.appendChild(currServicesHeading);

            let currServicesSect = document.createElement("section");
            let currServices = document.createElement("ul");
            currServicesSect.classList.add("separator");
            for (let i = 0; i < entry.services.length; i++) {
                let currLi = document.createElement("li");
                currLi.textContent = entry.services[i];
                currServices.appendChild(currLi);
            }
            currServicesSect.appendChild(currServices);
            currDiv.appendChild(currServicesSect);

            let currInsurancesHeading = document.createElement("p");
            currInsurancesHeading.textContent = "Insurances Offered:";
            currInsurancesHeading.classList.add('fake-heading');
            currDiv.appendChild(currInsurancesHeading);

            let currInsurancesSect = document.createElement("section");
            let insurances = document.createElement("ul");
            currInsurancesSect.classList.add("separator");
            let minIdx = 20;
            if (entry.insurances.length <= 20) {
                minIdx = entry.insurances.length;
            } 
            for (let i = 0; i < minIdx; i++) {
                let currLi = document.createElement("li");
                currLi.textContent = entry.insurances[i];
                insurances.appendChild(currLi);
            }
            if (entry.insurances.length > 20) {
                let currLi = document.createElement("li");
                currLi.textContent = "and more, contact for more information.";
                currLi.classList.add("contact-for-more");
                insurances.appendChild(currLi);
            }
            currInsurancesSect.appendChild(insurances);
            currDiv.appendChild(currInsurancesSect);

        }
        catch (e) {
            handleError(e);
        }

    }
init();
})();