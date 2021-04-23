const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const dbConnection= require('./config/db');


// Route File
const coachingCenter = require('./route/coschingCentre')

// Loading env varible
dotenv.config({ path : './config/config.env' });

// Connecting to Database
dbConnection()

const app = express()

//Middleware
app.use(express.json())
app.use(morgan('dev'));
//Body Parser


//Mount Route

app.use('/api/v1/bootcamps', coachingCenter)


const PORT = process.env.PORT || 5000

const server= app.listen(PORT,
    console.log(`Server is running on port ${PORT}`.yellow.underline.bold))

// Handles Unhandle Rejection
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error : ${err.message}`.red.bold)
    server.close(()=>process.exit(1))
})
