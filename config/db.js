const mongoose = require('mongoose');
const dotenv=require('dotenv');
const colors= require('colors')

dotenv.config({path : './config.env'});

const dbConnection = async ()=>{
    const conn =  await mongoose.connect(process.env.DATABASE_URI , {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    console.log("DB connection successul".cyan.underline)
}

module.exports = dbConnection