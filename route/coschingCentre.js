const express = require('express');
const router =  express.Router();
const { getCoachingcenters,
        getCoachingcenter,
        createCoachingcenter,
        updateCoachingcenter,
        deleteCoachingcenter,
        getCoachingCenterInRadius
} = require('./../controller/coachingCenter' )


router.get('/radius/:zipcode/:distance', getCoachingCenterInRadius)
router.get('/:id',getCoachingcenter);
router.get('/', getCoachingcenters);
router.post('/', createCoachingcenter);
router.put('/:id',updateCoachingcenter);
router.delete('/:id',deleteCoachingcenter);

module.exports = router;