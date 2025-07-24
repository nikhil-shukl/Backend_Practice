const mongoose = require('mongoose');
require("dotenv").config()

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlparser : true,
        useUnifiedTopology : true

    })
    .then(()=> {
        console.log("Database Connection established")
    })

    .catch((err) => {
        
        console.log("Connection issues with Database");
        process.exit(1);
    })
}