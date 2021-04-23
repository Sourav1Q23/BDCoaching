const CoachingCenter= require('./../Model/coachingCenter');
const ErrorClass = require('./../config/errorClass')
const asyncHandler= require('./../middleware/asyncHandler')
//@desc Get All Bootcamps
//route GET api/v1/bootcamps
//access Public

exports.getBootcamps = asyncHandler(async (req, res , next) => {
        const coachingCenters = await CoachingCenter.find();
        
        res.status(200).json({
            status: "Success",
            data: coachingCenters
        });        
})

//@desc Get a Bootcamps
//route GET api/v1/bootcamps/:id
//access Public

exports.getBootcamp =asyncHandler(async (req, res , next) => {
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

exports.createBootcamp = asyncHandler(async (req, res , next) => {
        const coachingCenter = await CoachingCenter.create(req.body)
        
        res.status(200).json({
            status: "Success",
            data: coachingCenter
        });
})

//@desc Update a Bootcamps
//route PUT api/v1/bootcamps/
//access private

exports.updateBootcamp = asyncHandler(async (req, res , next) => {
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

exports.deleteBootcamp = asyncHandler(async(req, res , next) => {
        const coachingCenter = await CoachingCenter.findByIdAndDelete(req.params.id)
        
        if (!coachingCenter){
            return res.status(404).json({
                success:false,
                data:null
            })
        }
        res.status(200).json({
            status: "Success",
            data: {}
        });        
})

