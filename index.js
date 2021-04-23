const express = require('express');
const dotenv = require('dotenv');


// Route File
const coachingCenter = require('./route/coschingCentre')

// Loading env varible
dotenv.config({ path : './config/config.env' });

const app = express()

//Mount Route

app.use('/api/v1/bootcamps', coachingCenter)


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running on port ${PORT}`))
