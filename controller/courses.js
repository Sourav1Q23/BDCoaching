const ErrorClass = require('../config/errorClass');
const asyncHandler = require('./../middleware/asyncHandler');
const Course = require('../Model/courses');
const CoachingCenter = require('./../Model/coachingCenter');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/coachingCenterId/:coachingCenterId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    
    if (req.params.coachingCenterId) {
        query =  Course.find({ bootcamp: req.params.coachingCenterId  });
     } else{
        query = Course.find()
    }    

    query= query.populate({
        path: 'bootcamp'
        ,select:'name description'
    })
    const courses= await query
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
     });
});

// @desc      Get a course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })

    if(!course){
        return next(new ErrorClass(`No course with the id of ${req.params.id}`),404)
    }


    return res.status(200).json({
      success: true,
      data: course
     });
});

// @desc      Create  a Course
// @route     POST /api/v1/coachingCenterId/:coachingCenterId/courses
// @access    Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    const coachingCenter = await CoachingCenter.findById(req.params.coachingCenterId)

    if (!coachingCenter){
        return next(new ErrorClass(`Bad request`, 404))
    }

    req.body.bootcamp = req.params.coachingCenterId

    const course = await Course.create(req.body)

    return res.status(200).json({
      success: true,
      data: course
     });
});

// @desc      Update a Course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id)

    if (!course){
        return next(new ErrorClass(`Bad request`, 404))
    }


    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    })

    return res.status(200).json({
      success: true,
      data: course
     });
});

// @desc      Update a Course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id)

    if (!course){
        return next(new ErrorClass(`Bad request`, 404))
    }


    await course.remove();

    return res.status(200).json({
      success: true,
      data:{}     
    });
});