const express = require('express');
const {getStories, postStory, deleteStory} = require('../controllers/story.js');

const router = express.Router();


router.get('/stories',getStories);
router.delete('/stories',deleteStory);
router.post('/stories',postStory);

module.exports =  router;