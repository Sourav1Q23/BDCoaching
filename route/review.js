const express = require('express');
const { getReviews, addReview, updateReview, deleteReview, getReview } = require('./../controller/review')

const router = express.Router({mergeParams: true});

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/',getReviews)
router.post('/', protect, authorize('user', 'admin'), addReview );

router.get('/:id', getReview)
router.put('/:id', protect, authorize('user', 'admin'), updateReview)
router.delete('/:id', protect, authorize('user', 'admin'), deleteReview);

module.exports = router;