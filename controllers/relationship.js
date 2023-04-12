
const db = require('../connect.js');
const jwt = require('jsonwebtoken');

const deleteRelation = (req,res)=>{

    const token = req.cookies.accessToken;
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'DELETE FROM relations WHERE followerUserID = ? AND followedUserID = ? ';
        const values = [userInfo.id,req.query.followedUserID]
        db.query(q,values , (error,data)=>{
         //   console.log(req.body.followedUserID)
            if(error) return res.status(500).json(error);
         //   console.log(data[0].id);
            return res.status(200).json('Unfollowed');

        })


    })


}

const getRelation = (req,res)=>{

const q = 'SELECT followerUserID from relations WHERE followedUserID = ? ';

db.query(q,[req.query.followedUserID], (err,data)=>{

    if(err) return res.status(500).json(err);
    return res.status(200).json(data.map( relationship=> relationship.followerUserID )  )
    //console.log(data);
    //return res.status(200).json(data)
    
})

}

const getFollowing = (req,res)=>{

    const q = 'SELECT followedUserID from relations WHERE followerUserID = ? ';
    
    db.query(q,[req.query.followerUserID], (err,data)=>{
    
        if(err) return res.status(500).json(err);
        return res.status(200).json(data.map( relationship=> relationship.followedUserID )  )
        //console.log(data);
        //return res.status(200).json(data)
        
    })
    
    }


    const getPosts = (req,res)=>{

        const q = 'SELECT id AS postID from posts WHERE userID = ? ';
        
        db.query(q,[req.query.userID], (err,data)=>{
            
            if(err) return res.status(500).json(err);
     
            return res.status(200).json(data.map( post=> post.postID )  )
            //console.log(data);
            //return res.status(200).json(data)
            
        })
        
        }

const addRelation = (req,res)=>{

    const token = req.cookies.accessToken;
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'INSERT INTO relations(`followerUserID`,`followedUserID`) VALUES (?); ';
        const values = [userInfo.id,req.body.followedUserID]
        db.query(q,[values] , (error,data)=>{
           // console.log(req.body.followedUserID)
            if(error) return res.status(500).json(error);
         //   console.log(data[0].id);
            return res.status(200).json('Followed');

        })


    })



}



module.exports = {addRelation,deleteRelation,getRelation, getFollowing,getPosts};