const express = require('express');
const {getLikes,addLike,deleteLike} = require('../controllers/like.js');

const router = express.Router();

router.post('/likes',addLike);
router.post('/likes/delete',deleteLike)
router.get('/likes',getLikes)

module.exports =  router;