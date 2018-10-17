const {request} = require('./getToken');
var fetchSymptom=(req,res,next)=>{
  // Url to fetch Symptom
  // The following API return list of all available symptom
  let url='https://healthservice.priaid.ch/symptoms'+'?token='+req.token+'&language=en-gb';
  let option={
    url,
    method:'GET'
  };
  let symptoms=[];
  request(option,(err,response,body)=>{
    if(err){
      // return to user with 500 HTTP status code
      res.status(500).send(err);
    }
    symptoms=JSON.parse(body);
    req.symptoms=symptoms;
    // continue execution of app.js
    next();
  });
};

module.exports={fetchSymptom};
