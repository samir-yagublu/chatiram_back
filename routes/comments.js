const express = require('express');
const {getComments, addComment,getCommentsNumber} = require('../controllers/comment.js');

const router = express.Router();


router.get('/comments',getComments)
router.post('/comment',addComment);
router.get('/comments/number',getCommentsNumber);

module.exports =  router;