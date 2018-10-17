This contains Information about app.js, the entry point to BackEnd.
It includes 3 user-defined middlewares
1. checkDB()
  -This middleware lies ahead of "http://localhost:3000/api1"
  -This checks MongoDB and find if the Database already contains Information about "Symptom"
  -If found, It retreives it and returns to Client
  -If not then it allows requst to hit "http://localhost:3000/api1"
2. getToken()
  -This middleware is used to fetch O-Auth token necessary for APIMedic operation
  -It hits the login of the host and gets back token
3. fetchSymptom()
  -This middleware is used to fetch Symptom from APIMedic
  -It send "HTTP GET request" to desired API and get back array of Symptoms
