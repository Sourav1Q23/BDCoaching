const express = require('express');
const { getCourses,
        getCourse,
        createCourse,
        updateCourse,
        deleteCourse
} = require('./../controller/courses' );
const { protect, authorize } = require('./../middleware/authMiddleware')

const router =  express.Router( {mergeParams: true});

// router.get('/radius/:zipcode/:distance', getCoachingCenterInRadius)
router.get('/:id',getCourse);
router.get('/', getCourses);
router.post('/',protect, authorize('publisher', 'admin'), createCourse);
router.put('/:id',protect,authorize('publisher', 'admin'), updateCourse);
router.delete('/:id',protect,authorize('publisher', 'admin'), deleteCourse);

module.exports = router;