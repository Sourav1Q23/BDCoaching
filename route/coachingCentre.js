const express = require('express');
const { getCoachingcenters,
        getCoachingcenter,
        createCoachingcenter,
        updateCoachingcenter,
        deleteCoachingcenter,
        getCoachingCenterInRadius
} = require('../controller/coachingCenter' )
const courseRouter= require('./courses'); 

const router =  express.Router();
router.use('/:coachingCenterId/courses', courseRouter)

router.get('/radius/:zipcode/:distance', getCoachingCenterInRadius)
router.get('/:id',getCoachingcenter);
router.get('/', getCoachingcenters);
router.post('/', createCoachingcenter);
router.put('/:id',updateCoachingcenter);
router.delete('/:id',deleteCoachingcenter);

module.exports = router;