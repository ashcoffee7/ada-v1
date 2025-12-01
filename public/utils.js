/**
 * CS 132
 * Provided global DOM aliases.
 * These are the ONLY functions that should be global in your submissions.
 */

/**
 * Returns the first element that matches the given CSS selector.
 * @param {string} selector - CSS query selector string.
 * @returns {object} first element matching the selector in the DOM tree
 * (null if none)
 */
function qs(selector) {
    return document.querySelector(selector);
}

/**
 * Returns the array of elements that match the given CSS selector.
 * @param {string} selector - CSS query selector
 * @returns {object[]} array of DOM objects matching the query (empty if none).
 */
function qsa(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Returns a new element with the given tagName
 * @param {string} tagName - name of element to create and return
 * @returns {object} new DOM element with the given tagName (null if none)
 */
function gen(tagName) {
    return document.createElement(tagName);
}


function checkStatus(response) {
    /**
     * Given a response object, check if it has resolved properly.
     * @param {Respose} - Response object
     * @return {None}
     */
    if (!response.ok) {
      let err = new Error("Error in request: " + response.statusText);;
      err.status = response.status;
      throw err;
    }
    return response;
}