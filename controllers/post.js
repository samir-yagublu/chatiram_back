const jwt = require('jsonwebtoken');
const db = require('../connect.js');
const moment = require('moment');

const getPosts = (req,res)=>{

    const token = req.cookies.accessToken;
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        const userID = req.query.userID;
      
        const qprofile = 'SELECT p.id as postID, p.description,p.img,p.userID,p.createDate, u.id , u.username, u.profilePic from posts as p JOIN users as u ON (u.id = p.userID) WHERE u.id = ? ORDER BY p.createDate DESC;'
        const q = 'SELECT DISTINCT p.id as postID, p.description,p.img,p.userID,p.createDate, u.id , u.username, u.profilePic from posts as p JOIN users as u ON (u.id = p.userID) LEFT JOIN relations as r ON (p.userID = r.followedUserID) WHERE r.followerUserID = ? OR p.userID = ? ORDER BY p.createDate DESC;';
        const values = userID == 'undefined' ? [userInfo.id,userInfo.id] : [userID]
        
        db.query((userID == 'undefined' ? q : qprofile),values , (error,data)=>{
            if(error) return res.status(500).json(error);
         
         //   console.log(data[0].id);
            return res.status(200).json(data);

        })


    })
}

const addPosts = (req,res)=>{

    const token = req.cookies.accessToken;
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'INSERT INTO posts(`description`,`img`,`userID`,`createDate`,`type` ) VALUES (?)';
        const values  =  [req.body.description, req.body.img, userInfo.id,
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), req.body.type
        ]
       // console.log(values);
        db.query(q, [values] , (error,data)=>{
            if(error) return res.status(500).json(error);
            //console.log(data);
            return res.status(200).json('Post has been created');

        })


    })
}

const category = (req,res)=>{

    const q = 'SELECT p.id as postID, p.description,p.img,p.userID,p.createDate, u.id , u.username, u.profilePic from posts as p JOIN users as u ON (u.id = p.userID) WHERE p.type = ? ORDER BY p.createDate DESC;'

    db.query(q,req.query.type,(err,data)=>{
        if(err) return res.status(500).json(err);

        return res.status(200).json(data)


    })


}

const deletePost = (req,res)=>{


    
        

        const q = 'DELETE FROM posts WHERE id = ?';
        
    
       // console.log(values);
        db.query(q, req.query.id , (error,data)=>{
            if(error) return res.status(500).json(error);
            //console.log(data);
            return res.status(200).json('Post has been deleted');

        })


   

}




module.exports = {getPosts, addPosts,category,deletePost}