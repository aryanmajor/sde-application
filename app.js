const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {getToken} = require('./middlewares/getToken');
const {request} = require('./middlewares/getToken');
const {SymptomInfo} = require('./db/schema/schema');
const {checkDB} = require('./middlewares/checkDB');
const {fetchSymptom} = require('./middlewares/fetchSymptom');

var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/ui'));

// Persistent variable session
var session={}; // Session here is a global variable which will be available for all Routes (API) forever

app.post('/api1',checkDB,getToken,fetchSymptom,(req,res)=>{
  session=req.session;// store the data from getToken middlewares
  session.token=req.token;// store token which will be Persistent for latter Routes

  let matchsymptom=undefined;
  matchsymptom=_.find(req.symptoms,function (obj) {
    // return a symptom which is present in the sentence
    // ex: extracts "fever" from "I have fever"
    return session.symptom.toLowerCase().includes(obj.Name.toLowerCase());
  });

  if(matchsymptom===undefined){
    // Symptom not found
    // send Bad Request HTTP code
    res.status(401).send();
  }
  else{
    // Symptom found
    // insert required data to symptom_info property of session
    session.symptom_info={};
    session.symptom_info.symptom=matchsymptom.Name;
    session.symptom_info.symptomID=matchsymptom.ID;
    // send Name and ID of symptom
    res.send(matchsymptom);
  }

});
/*
  API for finding various treatments
  API for finding diagnosis
*/
app.get('/api2',(req,res)=>{

  let url='https://healthservice.priaid.ch/diagnosis'+'?token='+session.token+'&language=en-gb'+'&symptoms=['+session.symptom_info.symptomID+']&gender='+session.gender+'&year_of_birth='+session.year_of_birth;
  var option={
    url,
    method:'GET'
  };

  // makes GET request to API medic API to fetch Diagnosis and Medical condition
  request(option,(err,response,body)=>{
    if(err){
      // if error return 500 HTTP Status Code
      res.status(500).send();
    }
    // Body contains diagnosis and treatment corresponding to Symptom
    body=JSON.parse(body);

    session.symptom_info.diagnosis=[]; // Again making diagnosis Persistent for latter Routes

    body.forEach((element)=>{
      let ans={};
      ans.diagName=element.Issue.Name;
      ans.diagProfName=element.Issue.ProfName;
      ans.treatment=[];
      element.Specialisation.forEach((e)=>{
        ans.treatment.push(e.Name);
      });

      session.symptom_info.diagnosis.push(ans);
    });
    // Send The Medical condition and Treatment
    res.send(session.symptom_info);
  });
});

/*
  API to write data to Database
  The Data is written to "Intern" Database in MongoDB
*/
app.get('/api3',(req,res)=>{

  var symptom=new SymptomInfo(session.symptom_info);  // Create new instance

  symptom.save().then((doc)=>{
    // if saved send Doc to user
    res.send(doc);
  }).catch((e)=>{
    // if there's some error
    // send HTTP status code 500
    res.status(500).send();
  });
});

/*
  API to get location of nearest Doctors
*/
app.get('/api4',(req,res)=>{
  // URL To fetch nearest places from GOOGLE
  // I've left my API key for easy implementation :)
  let url='https://maps.googleapis.com/maps/api/place/textsearch/json?query=doctor+for+'+req.query.symptom+'+near+me&key=AIzaSyB2JpWfV9ab-V9758sxt0sS8cUsI6OQ2I8&location='+req.query.loc+'&radius=5000';
  var option={
    url,
    method:'GET'
  };
  request(option,(err,response,body)=>{
    if(err){
      res.status(500).send();
    }
    body=JSON.parse(body);
    // send results property of body
    res.send(body.results);
  });
});

/*
  API 5 is combined with API 1
*/

// server listens to Port Number: 3000
app.listen('3000');
