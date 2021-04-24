const express = require('express');
const { getCourses,
        getCourse,
        createCourse,
        updateCourse,
        deleteCourse
} = require('./../controller/courses' );

const router =  express.Router( {mergeParams: true});

// router.get('/radius/:zipcode/:distance', getCoachingCenterInRadius)
router.get('/:id',getCourse);
router.get('/', getCourses);
router.post('/', createCourse);
router.put('/:id',updateCourse);
router.delete('/:id',deleteCourse);

module.exports = router;