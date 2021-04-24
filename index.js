const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const dbConnection= require('./config/db');
const errorhandler = require('./middleware/errorHandler')

// Route File
const coachingCenterRouter = require('./route/coachingCentre')
const courseRouter = require('./route/courses');

// Loading env varible
dotenv.config({ path : './config/config.env' });

// Connecting to Database
dbConnection()
const app = express()

//Middleware
app.use(express.json())
app.use(morgan('dev'));


//Mount Route
app.use('/api/v1/coachingCenter', coachingCenterRouter)
app.use('/api/v1/courses', courseRouter)
app.use(errorhandler)

const PORT = process.env.PORT || 3000

const server= app.listen(PORT,
    console.log(`Server is running on port ${PORT}`.yellow.underline.bold))

// Handles Unhandle Rejection
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error : ${err.message}`.red.bold)
    server.close(()=>process.exit(1))
})
