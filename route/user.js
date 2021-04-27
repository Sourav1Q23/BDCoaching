const express = require('express');
const User = require('../Model/user');
const { createUser, getUser, updateUser,deleteUser, getUsers
} = require('./../controller/user');


const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));
router.get('/users',getUsers)
router.post('/user', createUser);
router.get('/:id',getUser);
router.put('/:id',updateUser)
router.delete('/:id',deleteUser);

module.exports = router;