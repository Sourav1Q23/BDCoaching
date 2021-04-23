const express = require('express');
const router =  express.Router();
const { getBootcamps,
        getBootcamp,
        createBootcamp,
        updateBootcamp,
        deleteBootcamp
} = require('./../controller/coachingCenter')


router.get('/', getBootcamps);

router.post('/', createBootcamp);

router.get('/:id',getBootcamp);

router.put('/:id',updateBootcamp)

router.delete('/:id',deleteBootcamp);

module.exports = router;