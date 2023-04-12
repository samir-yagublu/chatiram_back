
const express = require('express');
const {addRelation,deleteRelation , getRelation,getFollowing,getPosts} = require('../controllers/relationship.js');

const router = express.Router();

router.post('/follow',addRelation)
router.get('/follow', getRelation);
router.get('/follow/follows', getFollowing);
router.get('/nposts',getPosts)

router.delete('/follow',deleteRelation)


module.exports =  router;
