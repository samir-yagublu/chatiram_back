const express = require('express');
const router = express.Router();
const {getLocation,postLocation,updateLocation} = require('../controllers/location');


router.get('/locations',getLocation);
router.post('/locations',postLocation);
router.put('/locations',updateLocation);
module.exports = router;