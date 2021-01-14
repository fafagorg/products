const mongoose = require('mongoose');

const {
    MONGO_PORT,
    MONGO_DB
  } = process.env;
  
  const options = {
    useNewUrlParser: true,
    connectTimeoutMS: 10000,
    useUnifiedTopology: true
  };

let DB_URL;

if (MONGO_PORT && MONGO_DB) {
  DB_URL = `mongodb://mongoproducts/${MONGO_DB}`;
} else {
  DB_URL = 'mongodb://localhost:27017/productsBD';
}

//const DB_URL = (process.env.MONGO_URL || 'mongodb://localhost:27017/productsBD');

const dbConnect = function(){
    const db = mongoose.connection;
    db.on('error', console.error.bind(console,'connection error: '));
    return mongoose.connect(DB_URL,options);
}

module.exports = dbConnect;