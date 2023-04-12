const db = require('../connect.js');
const jwt = require('jsonwebtoken');




const getLocation = (req,res)=>{

    const q = 'SELECT latitude , longitude from locations WHERE userID = ? ';

    db.query(q,req.query.userID,(err,data)=>{
        if(err) return res.status(500).json(data);
        return res.status(200).json(data)

    })


}



const postLocation =(req,res)=>{

    const token = req.cookies.accessToken;
    // console.log(token)
     if(!token) return res.status(401).json('User not logged in')
      jwt.verify(token,'ysamir',(err,userInfo)=>{
         if(err) return res.status(403).json('Token is not valid');
         
 
         const q = 'INSERT INTO locations(latitude,longitude,userID) VALUES (?);';
         const values = [req.body.latitude,req.body.longitude,req.body.userID]
         db.query(q,[values] , (error,data)=>{
          //   console.log(req.body.followedUserID)
             if(error) return res.status(500).json(error);
          //   console.log(data[0].id);
             return res.status(200).json('Location stored');
 
         })
 
 
     })



}

const updateLocation = (req,res)=>{

    const token = req.cookies.accessToken;
    // console.log(token)
     if(!token) return res.status(401).json('User not logged in')
      jwt.verify(token,'ysamir',(err,userInfo)=>{
         if(err) return res.status(403).json('Token is not valid');
         
 
         const q = 'UPDATE locations SET latitude = ?, longitude = ? WHERE userID = ? ;';
         const values = [req.body.latitude,req.body.longitude,req.body.userID]
         db.query(q,values , (error,data)=>{
          //   console.log(req.body.followedUserID)
             if(error) return res.status(500).json(error);
          //   console.log(data[0].id);
             return res.status(200).json('Location updated');
 
         })
 
 
     })



}

module.exports={getLocation,postLocation,updateLocation};