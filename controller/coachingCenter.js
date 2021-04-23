const CoachingCenter= require('./../Model/coachingCenter');

//@desc Get All Bootcamps
//route GET api/v1/bootcamps
//access Public

exports.getBootcamps = async (req, res , next) => {
    try {
        const coachingCenters = await CoachingCenter.find();
        
        res.status(200).json({
            status: "Success",
            data: coachingCenters
        });        
    } catch (err) {
        res.status(400).json({
            success:false
        })      
    }    

}

//@desc Get a Bootcamps
//route GET api/v1/bootcamps/:id
//access Public

exports.getBootcamp = async (req, res , next) => {
    try {
        const coachingCenter = await CoachingCenter.findById(req.params.id)
        
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
    } catch (err) {
        res.status(400).json({
            success:false
        })      
    }
}

//@desc Create a Bootcamps
//route POST api/v1/bootcamps/
//access private

exports.createBootcamp = async (req, res , next) => {
    try {
        console.log(req.body)
        const coachingCenter = await CoachingCenter.create(req.body)
        
        res.status(200).json({
            status: "Success",
            data: coachingCenter
        });        
    } catch (err) {
        res.status(400).json({
            success:false
        })      
    }
}

//@desc Update a Bootcamps
//route PUT api/v1/bootcamps/
//access private

exports.updateBootcamp = async (req, res , next) => {
    try {
        console.log(req.body)
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
    } catch (err) {
        res.status(400).json({
            success:false
        })      
    }
}

//@desc Delete a Bootcamps
//route DELETE api/v1/bootcamps/
//access private

exports.deleteBootcamp = async(req, res , next) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            success:false
        })      
    }
}

