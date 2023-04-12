const express = require('express');
const {getUser, updateUsers, searchUser} = require('../controllers/user.js');

const router = express.Router();


router.get('/profile/find/:userID',getUser)
router.put('/users',updateUsers);
router.get('/search',searchUser)

module.exports =  router;