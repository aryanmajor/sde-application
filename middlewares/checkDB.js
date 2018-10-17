const {SymptomInfo} = require('./../db/schema/schema');

var checkDB=(req,res,next)=>{
  SymptomInfo.findOne({
    // checks if a symptom is already in DB
    symptom: req.body.symptom.toLowerCase()
  }).then((doc)=>{
    if(!doc){
      // No Record present
      // Return cursor to app.js
      next();
    }
    else{
      res.send(doc);
    }
  }).catch((err)=>{
    // Error Return to user
    res.status(500).send();
  });
};

module.exports={checkDB};
