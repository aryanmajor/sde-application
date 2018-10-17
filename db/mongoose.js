const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// connects to mongodb://127.0.0.1:27017
mongoose.connect('mongodb://localhost:27017/Intern', {useNewUrlParser:true});

// export "mongoose" so that it can be used in other documents
module.exports = {mongoose};
