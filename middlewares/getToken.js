const request = require('request').defaults({
  proxy:'http://172.16.30.20:8080',
  StrictSSL:false
});

const cryptojs = require('crypto-js');

var getToken=(req,res,next)=>{
  // following request makes API call to APIMedic api to genrate O auth2 token
  var uri='https://authservice.priaid.ch/login';

  var api_key='x2CFy_GMAIL_COM_AUT';// I've left my API key for easy implementation :)
  var hash=cryptojs.HmacMD5(uri,'m3JFg29Hsn4D7RbSi');// I've left my API key for easy implementation :)
  hash=hash.toString(cryptojs.enc.Base64);
  var option={
    uri,
    headers:{
      'Authorization':'Bearer '+ api_key +':'+hash
    }
  };
  request.post(option,(err,response,body)=>{
    if(err){
      res.status(500).send();
    }
    body=JSON.parse(body);

    req.session={};
    req.session.symptom=req.body.symptom;
    req.session.gender=req.body.gender;
    req.session.year_of_birth=req.body.year_of_birth;
    req.token=body.Token;

    next();
  });
};
// export requrst and getToken
module.exports={getToken,request};
