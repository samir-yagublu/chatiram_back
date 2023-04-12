const express = require('express');
const {getPosts, addPosts,category,deletePost } = require('../controllers/post.js');

const router = express.Router();

router.post('/post',addPosts)
router.get('/posts', getPosts)
router.delete('/post',deletePost)
router.get('/posts/category',category)
module.exports =  router;