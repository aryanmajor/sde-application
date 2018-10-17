The project has BackEnd Scripting on NodeJS and uses ExpressJS framework. The Database Software used is MongoDB.
To run the application:
1. Start MongoDB server on localhost on Port Number 27017
  the app connects to "mongodb://localhost:27017"
2. Start Server by first going to directory and then executing Following commands
  "node app.js"
3. Open Browser (Google chrome preferred)
  Go to "localhost:3000/index.html"
4. Input The info and click Submit
  -The Click on submit button fires an AJAX request which hits http://localhost:3000/api1
  -This returns the Symptom after Sync with APIMedic API
  -The main.js Fires 2 more AJAX requests to following APIs
  http://localhost:3000/api2
    This return diagnosis and medical condition for the above symptoms
    This also finds treatment for above symptoms
  http://localhost:3000/api3
    This API stores the above info in "Intern" Database in MongoDB
5. You are then displayed with A Table representing the Information
  You are provided with an option to "Find Doctor Near Me"
6. If clicked, the main.js extracts your location by GeoLocation of JavaScript
  and then fires another AJAX request to http://localhost:3000/api4
  -This API uses googleapis to find doctors related to Symptom
  -The location is also provided for that purpose
7. The Information from googleapis is then displayed to you

PS:-- "API 5 (Bonus)" is combined with api1 in my application
      Example: it can take "I have fever" as input and return you with info about fever etc.
