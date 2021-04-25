const express = require('express');
const { getCoachingcenters,
        getCoachingcenter,
        createCoachingcenter,
        updateCoachingcenter,
        deleteCoachingcenter,
        getCoachingCenterInRadius,
        coachingCenterFileUpload
} = require('../controller/coachingCenter' )
const courseRouter= require('./courses');
const { protect, authorize } = require('./../middleware/authMiddleware')
 

const router =  express.Router();
router.use('/:coachingCenterId/courses', courseRouter)

router.get('/radius/:zipcode/:distance', getCoachingCenterInRadius)
router.get('/:id',getCoachingcenter);
router.get('/', getCoachingcenters);
router.post('/',protect,authorize('publisher', 'admin'), createCoachingcenter);
router.put('/:id',protect,authorize('publisher', 'admin'), updateCoachingcenter);
router.delete('/:id',protect, authorize('publisher', 'admin'), deleteCoachingcenter);
router.put('/:id/upload', protect,authorize('publisher', 'admin'), coachingCenterFileUpload);

module.exports = router;