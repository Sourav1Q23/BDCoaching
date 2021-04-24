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

    console.log(reqQuery)

    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);
    
    console.log(queryStr);

    query = CoachingCenter.find(JSON.parse(queryStr)).populate('courses');

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
        const coachingCenter = await CoachingCenter.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        
        if (!coachingCenter){
            return res.status(404).json({
                success:false,
                data:null
            })
        }
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
            return res.status(404).json({
                success:false,
                data:null
            })
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
  
