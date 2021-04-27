const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path')
const fileupload = require('express-fileupload');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const dbConnection= require('./config/db');
const errorhandler = require('./middleware/errorHandler')

// Route File
const coachingCenterRouter = require('./route/coachingCentre')
const courseRouter = require('./route/courses');
const authRouter = require('./route/auth')
const adminRouter = require('./route/user')
const reviewRouter = require('./route/review')

// Loading env varible
dotenv.config({ path : './config/config.env' });

// Connecting to Database
dbConnection()
const app = express()

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(fileupload());
app.use(express.static(path.join(__dirname,'public')));


//Mount Route
app.use('/api/v1/coachingCenter', coachingCenterRouter)
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/auth', authRouter) 
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use(errorhandler)

const PORT = process.env.PORT || 3000

const server= app.listen(PORT,
    console.log(`Server is running on port ${PORT}`.yellow.inverse.bold))

// Handles Unhandle Rejection
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error : ${err.message}`.red.bold)
    server.close(()=>process.exit(1))
})
