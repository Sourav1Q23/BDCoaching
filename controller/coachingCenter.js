const path = require('path')
const CoachingCenter= require('./../Model/coachingCenter');
const ErrorClass = require('./../config/errorClass');
const asyncHandler= require('./../middleware/asyncHandler');
const geocoder = require('./../config/geocoder')

//@desc Get All Bootcamps
//route GET api/v1/bootcamps
//access Public

exports.getCoachingcenters = asyncHandler(async (req, res , next) => {
    let query;
    
    const reqQuery = {...req.query}

    const fieldRemove=['select','sort','limit','page']

    fieldRemove.forEach( param=> delete reqQuery[param]) 

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);
       

    query = CoachingCenter.find(JSON.parse(queryStr)) .populate('courses');

    if(req.query.select){
        const fields =  req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }else{
        query = query.sort('-createdAt')
    }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const startIndex = (page-1)* limit;
    const endIndex = page * limit
    const total = await CoachingCenter.countDocuments()
    
    query = query.skip(startIndex).limit(limit);
    
    const coachingCenters = await query;

    const pagination = {}
    if (endIndex< total){
        pagination.next ={
            page : page+1,
            limit
        }
    }

    if (startIndex>0){
        pagination.prev={
            page: page-1,
            limit       
        }
    }

         
    res.status(200).json({
        status: "Success",
        resultLength: coachingCenters.length,
        pagination,
        data: coachingCenters
    });        
})

//@desc Get a Bootcamps
//route GET api/v1/bootcamps/:id
//access Public

exports.getCoachingcenter =asyncHandler(async (req, res , next) => {
        const coachingCenter = await CoachingCenter.findById(req.params.id)
        
        if (!coachingCenter){
            return next(new ErrorClass(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({
            status: "Success",
            data: coachingCenter
        });        
    
})

//@desc Create a Bootcamps
//route POST api/v1/bootcamps/
//access private

exports.createCoachingcenter = asyncHandler(async (req, res , next) => {
    req.body.user = req.user.id
    
    const publishedCoachingCenter = await CoachingCenter.findOne({ user:req.user.id})

    if(publishedCoachingCenter && !req.user.role!=='admin'){
        return next(new ErrorClass('The User already published a Coachin Ceter',401))
    }

    const coachingCenter = await CoachingCenter.create(req.body)
    
    res.status(200).json({
        status: "Success",
        data: coachingCenter
    });
})

//@desc Update a Bootcamps
//route PUT api/v1/bootcamps/
//access private

exports.updateCoachingcenter = asyncHandler(async (req, res , next) => {
    let coachingCenter= await CoachingCenter.findById(req.params.id)
    
    if (!coachingCenter){
        return next(new ErrorClass(`No coaching center found with id ${req.params.id}`,404))
    }
    if (coachingCenter.user.toString()!== req.user.id && req.user.role!=='admin'){
        return next(new ErrorClass(`User ${req.user.id} is not authorziedto update this CoachingCenter`,401))
    }

    coachingCenter = await CoachingCenter.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    
    coachingCenter= await CoachingCenter.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: "Success",
        data: coachingCenter
    }); 
})

//@desc Delete a Bootcamps
//route DELETE api/v1/bootcamps/
//access private

exports.deleteCoachingcenter = asyncHandler(async(req, res , next) => {
        const coachingCenter = await CoachingCenter.findById(req.params.id)
        
        if (!coachingCenter){
            return next(new ErrorClass(`No coaching center found with id ${req.params.id}`,404))
        }
        if (coachingCenter.user.toString()!== req.user.id && req.user.role!=='admin'){
            return next(new ErrorClass(`User ${req.user.id} is not authorziedto delete this CoachingCenter`,401))
        }

        coachingCenter.remove()
        res.status(200).json({
            status: "Success",
            data: {}
        });        
})

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getCoachingCenterInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
  
    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
  
    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
  
    const coachingsCenter = await CoachingCenter.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
  
    res.status(200).json({
      success: true,
      length: coachingsCenter.length,
      data: coachingsCenter
    });
  });
  
//@desc Delete a Bootcamps
//route DELETE api/v1/bootcamps/
//access private

exports.coachingCenterFileUpload = asyncHandler(async(req, res , next) => {
    const coachingCenter = await CoachingCenter.findById(req.params.id)
    
    if (!coachingCenter){
        return next(new ErrorClass(`No coaching center found with id ${req.params.id}`,404))
    }
    if (coachingCenter.user.toString()!== req.user.id && req.user.role!=='admin'){
        return next(new ErrorClass(`User ${req.user.id} is not authorziedto update this CoachingCenter`,401))
    }
    if (!req.files){
        return next(new ErrorClass("No fle Uploaded",400))
    }
    const file= req.files.file
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorClass("Please Upload an image File",400))
    }

    if(file.size > process.env.MAX_File_UPLOAD){
        return next(new ErrorClass(`Please Upload an image File less than ${process.env.MAX_File_UPLOAD}`,400))
    }

    file.name=`photo_${coachingCenter._id}${path.parse(file.name).ext}`
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
          console.error(err);
          return next(new ErrorClass(`Problem with file upload`, 500));
        }
    
        await CoachingCenter.findByIdAndUpdate(req.params.id, { photo: file.name });
    
      
    res.status(200).json({
        status: "Success",
        data: file.name
        });        
    })
})
