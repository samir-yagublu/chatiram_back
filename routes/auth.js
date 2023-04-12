const express = require('express');

const {register} = require('../controllers/auth.js');
const {login} = require('../controllers/auth.js');
const {verify} = require('../controllers/auth.js')
const {logout} = require('../controllers/auth.js')
const router = express.Router();


 router.post('/register', register);

router.get('/verify/:token',verify);
 router.post('/logout',logout);
 router.post('/login',login);

module.exports =  router;