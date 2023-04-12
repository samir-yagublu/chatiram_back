const jwt = require('jsonwebtoken');
const db = require('../connect.js');
const moment = require('moment');

const getStories = (req,res)=>{

    
    
    const token = req.cookies.accessToken;
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');

 const q = 'SELECT s.id as storyID, s.img, u.id, u.username FROM stories AS s JOIN users as u ON (s.userID = u.id) LEFT JOIN relations AS r ON (s.userID = r.followedUserID) WHERE r.followerUserID = ? OR s.userID = ?;'
        db.query(q,[userInfo.id,userInfo.id], (error,data)=>{
            if(error) return res.status(500).json(error);
            return res.status(200).json(data);


        })

     })
}


const postStory = (req,res)=>{

    const token = req.cookies.accessToken;
   // console.log(token)
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'INSERT INTO stories(`img`,`userID`,`createDate`) VALUES (?)';
        const values  =  [req.body.img, userInfo.id,
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') 
        ]
        db.query(q, [values] , (error,data)=>{
            if(error) return res.status(500).json(error);
           // console.log(data);
            return res.status(200).json('Story has been created');

        })


    })



}

const deleteStory = (req,res)=>{


    
        

    const q = 'DELETE FROM stories WHERE id = ?';
    

   // console.log(values);
    db.query(q, req.query.id , (error,data)=>{
        if(error) return res.status(500).json(error);
        //console.log(data);
        return res.status(200).json('Story has been deleted');

    })




}

module.exports = {getStories,postStory,deleteStory}