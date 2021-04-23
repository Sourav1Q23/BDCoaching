//@desc Get All Bootcamps
//route GET api/v1/bootcamps
//access Public

exports.getBootcamps = (req, res , next) => {
    res.status(200).json({
        status: "Success",
        data: " Shows all bootcamps"
    });
}

//@desc Get a Bootcamps
//route GET api/v1/bootcamps/:id
//access Public

exports.getBootcamp = (req, res , next) => {
    res.status(200).json({
        status: "Success",
        data: `Shows bootcamp with ID : ${req.params.id}`
    });
}

//@desc Create a Bootcamps
//route POST api/v1/bootcamps/
//access private

exports.createBootcamp = (req, res , next) => {
    res.status(200).json({
        status: "Success",
        data: `Created a Bootcamp `
    });
}

//@desc Update a Bootcamps
//route PUT api/v1/bootcamps/
//access private

exports.updateBootcamp = (req, res , next) => {
    res.status(200).json({
        status: "Success",
        data: `updated a Bootcamps a Bootcamp `
    });
}

//@desc Delete a Bootcamps
//route DELETE api/v1/bootcamps/
//access private

exports.deleteBootcamp = (req, res , next) => {
    res.status(200).json({
        status: "Success",
        data: `Deleted a Bootcamp `
    });
}

