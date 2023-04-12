
const db = require('../connect.js')
const jwt = require('jsonwebtoken');

const getLikes = (req,res)=>{

    const q = 'SELECT userID from likes WHERE postID = ?';

    db.query(q,[req.query.postID] , (error,data)=>{
        if(error) return res.status(500).json(error);

       
       ///console.log(data);

        return res.status(200).json(data.map(like=>like.userID));

    })


}


const addLike = (req,res)=>{

    const token = req.cookies.accessToken;
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'INSERT INTO likes(`userID`, `postID`) VALUES (?)';
       
        const values  =  [ userInfo.id, req.body.postID]
       // console.log(values)
        db.query(q, [values] , (error,data)=>{
            if(error) return res.status(500).json(error);
           
            return res.status(200).json('Post has been liked');

        })


    })
}


const deleteLike = (req,res)=>{
   
    const token = req.cookies.accessToken;
  
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'DELETE FROM likes WHERE userID = ? AND postID = ?';
       
        
       // console.log(values)
        db.query(q, [userInfo.id, req.body.postID ], (error,data)=>{
            if(error) return res.status(500).json(error);
      
            return res.status(200).json('Post has been disliked');

        })


    })
}


module.exports = {getLikes,addLike,deleteLike}