const {mongoose} = require('./../mongoose');

var Schema=mongoose.Schema;
var SymptomSchema=new Schema({
  symptom:{
    type: String,
    required: true,
    lowercase:true
  },
  symptomID:{
    type: Number,
    required: true
  },
  diagnosis:[{
    diagName:{
      type: String
    },
    diagProfName:{
      type:String
    },
    treatment:[String]
  }]
});

var SymptomInfo=mongoose.model('SymptomInfo',SymptomSchema);

module.exports={SymptomInfo};
