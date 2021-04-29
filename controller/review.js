const ErrorClass = require('../config/errorClass');
const asyncHandler = require('../middleware/asyncHandler');
const Review = require('./../Model/review');
const CoachingCenter = require('../Model/coachingCenter');

// @desc      Get reviews
// @route     GET /api/v1/coachingcenter/:coachingcenterId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    console.log(req.params.coachingcenterId)
    const reviews = await Review.find({ coachingcenter: req.params.coachingCenterId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'coachingcenter',
    select: 'name description'
  });

  if (!review) {
    return next(
      new ErrorClass(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc      Add review
// @route     POST /api/v1/coachingcenter/:coachingcenterId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.coachingcenter = req.params.coachingCenterId;
  req.body.user = req.user.id;

  const coachingcenter = await CoachingCenter.findById(req.params.coachingCenterId);

  if (!coachingcenter) {
    return next(
      new ErrorClass(
        `No coaching center with the id of ${req.params.coachingCenterId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorClass(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorClass(`Not authorized to update review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorClass(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorClass(`Not authorized to update review`, 401));
  }

  await review.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});