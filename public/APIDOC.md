# CS132 FemHealthAPI Documentation
**Author:** Ashlyn Roice
**Last Updated:** 06/14/2025

FemHealthAPI provides information on various women's healthcare centers and LGBTQ+-affirming healthcare centers, with a goal to empower the democratization of this critical health information.

Summary of endpoints:
* GET /ada/all-centers
* GET /ada/top-five
* GET /ada/center-info
* POST /ada/send-admin-req
* POST /ada/send-question
* GET /ada/get-questions
* POST /ada/login
* GET /ada/get-admins
* POST /ada/signup

In the current version of the API, all error responses are sent as a JSON which redirects away from the API. Contact aroice@caltech.edu with any questions.

## *GET /ada/all-centers
**Description**: Retrieves a summary of information for all health resource centers within our database. Includes information on the name, address, and image address.

**Parameters**: None

**Returned Data Format**: JSON

**Example Request**: GET /ada/all-centers

**Example Response:** 
[
  {
    "name": "Community Resource Centers",
      "address": "4801 Whittier Blvd, East Los Angeles, CA 90022",
      "services": ["Member support", "Health education", "Telehealth access"],
      "insurances": ["L.A. Care Health Plan members (Medi-Cal HMO)"],
      "image-address": "https://images1.loopnet.com/i2/WaRaaN8s3gjJp4pv2K41t36TXTwyq6uWHWGjTxQ0jXU/112/image.jpg"
  }
]

**Error Handling**:
* 500: Server error 

## *GET /ada/top-five?address=

**Returned Data Format**: JSON

**Description**: Returns the top 5 closest centers based on the user's address using FemHealthAPI. Ranks the top 5 closest locations using Google Maps Distance Matrix API.

**Parameters:**
* "address" (string)
    * The user's address (their input)

**Example Request**: `GET \ada\top-five?address=306%20W%20Piedmont%20Drive

**Example Response:**
[
  {
    "name": "Los Angeles LGBT Center",
    "address": "1625 N Schrader Blvd, Los Angeles, CA 90028",
    "distanceValue": "524 km",
    "image-address": "https://lalgbtcenter.org/app/uploads/2023/07/LGBT-Center_AMRC-September-2019_2560x1140.jpg"
  },
  {
    "name": "Tia",
    "address": "8500 W Sunset Blvd Suite 103, West Hollywood, CA 90069",
    "distanceValue": "528 km",
    "image-address": "https://cdn.sanity.io/images/8qqycr4y/production/9eab674d81a53e2249b1f4e7c01932efef86cda6-2000x1400.jpg?w=768&h=538&fit=crop"
  },
  {
    "name": "Planned Parenthood - Hollywood",
    "address": "1014 1/2 N Vermont Ave, Los Angeles, CA 90029",
    "distanceValue": "528 km",
    "image-address": "https://abortiondocs.org/wp-content/uploads/2019/09/Hollywood-Planned-Parenthood.jpg"
  },
  {
    "name": "Saban Community Clinic",
    "address": "8405 Beverly Blvd, Los Angeles, CA 90048",
    "distanceValue": "530 km",
    "image-address": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=JCiNdG5adOuHeFbt4RxPsA&cb_client=search.gws-prod.gps&w=408&h=240&yaw=295.08066&pitch=0&thumbfov=100"
  },
  {
    "name": "FPA Women's Health (Downtown LA)",
    "address": "601 Westmoreland Ave, Los Angeles, CA 90005",
    "distanceValue": "530 km",
    "image-address": "https://s3-media0.fl.yelpcdn.com/bphoto/kPlCoCLxUrZ68lv00Vq3CA/348s.jpg"
  }
]

**Error Handling**:
* 404: Missing or invalid address.
* 500: Google Maps API failure or server issue.

**Example Request**:
* `ada/top-five?address=`

**Example Response:**
* Invalid address provided, please try again.
*  There was a server issue, check your address and try again.

## *GET /ada/center-info

**Returned Data Format**: JSON

**Description**: Fetches all information (name, location, insurances taken, services offered, image address) related to a certain center. The center must be in the API database.

**Parameters:**
* "name" (string)
    * Name of the center in question

**Example Request**: `GET/ada/center-info?name=Tia`

**Example Response:**
{
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

**Error Handling**:
* 400: Missing or unavailable center.
* 500: Server failure.

**Example Request**:
* `ada/center-info?Subway`

**Example Response:**
* "You must provide the name of a center."

## *POST /ada/send-admin-req

**Returned Data Format**: JSON message

**Description**: Submits a request for admin privileges. Only an admin may make this request.

**Parameters:**
* "name-admin" (string)
    * username of the user
* "email-admin" (string)
    * email of the user

**Example Request**: `GET/ada/send-admin-req`
body = {
  "name-admin": "Alex",
  "email-admin": "alex@example.com"


**Example Response:**
{ "Success": "Sent admin request!" }

**Error Handling**:
* 400: Missing or invalid field.
* 500: Server failure.

**Example Request**:
* `ada/send-admin-req`
* body = {
    "name-admin": ,
    "email-admin": 
}

**Example Response:**
* Please ensure all fields are filled out.

## *POST /ada/send-question

**Returned Data Format**: JSON message

**Description**: Allows users to send questions to be included in our database. We set the top 5 most frequent to be listed in our FAQ.

**Parameters:**
* "name-submit" (string)
    * name of the user
* "email-submit" (string)
    * email of the user
* "question-submit" (string)
    * user's question

**Example Request**: `POST /ada/send-question`
body = {
  "name-submit": "Alex",
  "email-submit": "alex@example.com",
  "question-submit": "Who made FemHealthAPI?"
}


**Example Response:**
{ "Success": "Sent question!" }

**Error Handling**:
* 500: Server failure.

**Example Request**:
* `ada/send-admin-req`
* body = {
    "name-admin": ,
    "email-admin": 
}

**Example Response:**
* Please ensure all fields are filled out.

## *GET /ada/get-questions

**Returned Data Format**: JSON message

**Description**: Retrieves all submitted questions within our database. Users can navigate questions and see the most frequently asked questions/concerns about FemHealthAPI.

**Parameters:**
* None

**Example Request**: `GET /ada/get-questions`


**Example Response:**

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
  },
  {
    "name": "123",
    "email": "123",
    "question": "123"
  },
  {
    "name": "Ashlyn Roice",
    "email": "aroice@caltech.edu",
    "question": "123"
  },
  {
    "name": "Ashlyn Roice",
    "email": "ashlyn.roice@gmail.com",
    "question": "asdasd"
  },
  {
    "name": "Ashlyn Roice",
    "email": "ashlyn.roice@gmail.com",
    "question": "qwe"
  }
]

**Error Handling**:
* 500: Server failure.

**Example Response:**
* There was an error with the server, please try again later.

## *POST /ada/login

**Returned Data Format**: JSON message

**Description**: Validates all login credentials. Compares given username to the password associated with the account. Authenticates users with matching usernames and passwords and handles errors for users who have invalid fields or mismatched usernames/passwords.

**Parameters:**
* "username-submit" (string)
    * the username of the user
* "password-submit" (string)
    * the password of the user

**Example Request**: `POST /ada/login`
body = {
    "username-submit": aroice,
    "password-submit": Goldilocks123!
}

**Example Response:**
{"success": true, "username": "aroice"}

**Error Handling**:
* 400: Missing credentials
* 401: Invalid login
* 500: Server Error

**Example Request:**
*  `POST /ada/login`
body = {
    "username-submit": ,
    "password-submit": 
}
*  `POST /ada/login`
body = {
    "username-submit": aroice,
    "password-submit": Goldilocks123
}

**Example Response:**
* You must enter some username or password.
* Invalid credentials.

## *GET /ada/get-admins

**Returned Data Format**: JSON message

**Description**: Returns a list of all usernames who are administrators.

**Parameters:**
* None

**Example Request**: `GET /ada/get-admins`

**Example Response:**
{"admins":["ashroice"]}

**Error Handling**:
* 500: Server Error

**Example Response:**
* "Something went wrong, please try again."

## *POST /ada/signup

**Returned Data Format**: JSON message

**Description**: Returns a list of all usernames who are administrators.

**Parameters:**
* "user-signup" (string)
    * username for the signup
* "password-signup" (string)
    * password for the signup
* "email-signup" (string)
    * email for the signup

**Example Request**: `POST /ada/signup`
body = {
    "user-signup": "ashlynroice",
    "password-signup": "blooing",
    "email-signup": aroice@caltech.edu
}

**Example Response:**
{ "success": "Signed up successfully! Please log in." }

**Error Handling**:
* 404: Missing fields
* 500: Server Error

**Example Response:**
* "Something went wrong, please try again."































