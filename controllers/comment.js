const db = require('../connect.js')
const jwt = require('jsonwebtoken');
const moment = require('moment');
const getComments = (req,res)=>{

  
    const q = 'SELECT c.id as commentID,c.description,c.createDate, c.userID, c.postID, u.id , u.name, u.profilePic from comments as c JOIN users as u ON (u.id = c.userID) WHERE  c.postID = ? ORDER BY c.createDate DESC;';
    db.query(q,[req.query.postId] , (error,data)=>{
            if(error) return res.status(500).json(error);
            console.log(data.length)
          //  console.log('comment.js post id =',req.query.postId);
           // console.log(data);

            return res.status(200).json(data);

        })

}
const getCommentsNumber = (req,res)=>{

  
    const q = 'SELECT c.id FROM comments as c JOIN posts as p ON (c.postID = p.id) WHERE c.postID = ?';
    //console.log(req.body.postID)
    db.query(q,[req.query.postID] , (error,data)=>{
            if(error) return res.status(500).json(error);

            if(data.length != 0){
           // console.log( 'if in icinde data = '+ data);
            return res.status(200).json(data);}
            else{
           // console.log('else in icinde data length'+ data.length)
            return res.status(200).json([]);
            }
           

        })

}  

const addComment = (req,res)=>{

    const token = req.cookies.accessToken;
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'INSERT INTO comments(`description`, `userID`, `postID` ,`createDate`) VALUES (?)';
       // console.log(userInfo.id);
        const values  =  [req.body.description, userInfo.id, req.body.postID,
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') 
        ]
        console.log(values)
        db.query(q, [values] , (error,data)=>{
            if(error) return res.status(500).json(error);
            console.log(data);
            return res.status(200).json('Comment has been created');

        })


    })
}


module.exports = {getComments,addComment,getCommentsNumber}