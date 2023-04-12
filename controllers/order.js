
const db = require('../connect.js');
const jwt = require('jsonwebtoken');

const getOrders = (req,res)=>{
  

    const q = 'SELECT personalID from orders WHERE ustaID = ? ';
    
    db.query(q,[req.query.ustaID], (err,data)=>{
    
        if(err) return res.status(500).json(err);
        // if(data.length > 1) return res.status(403).json('You can only order one usta')
        return res.status(200).json(data.map( order=> order.personalID )  )
        //console.log(data);
        //return res.status(200).json(data)
        
    })

    }
    const getVerified = (req,res)=>{
 

      const q = 'SELECT isAccepted from orders WHERE ustaID = ? and personalID = ?';

     const values = [req.query.ustaID,req.query.personalID]
      db.query(q, values, (err,data)=>{
      
          if(err) return res.status(500).json(err);
     
          return res.status(200).json(data)
    
          
      })

      }

 const makeOrder = (req,res)=>{

    const token = req.cookies.accessToken;
   // console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'INSERT INTO orders(ustaID,personalID) VALUES (?);';
        const values = [req.body.ustaID,userInfo.id]
        db.query(q,[values] , (error,data)=>{
         //   console.log(req.body.followedUserID)
            if(error) return res.status(500).json(error);
         //   console.log(data[0].id);
            return res.status(200).json('Order is created successfully');

        })


    })

 }   

 const deleteOrder = (req,res)=>{

    const token = req.cookies.accessToken;
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'DELETE FROM orders WHERE personalID = ? and ustaID = ?';
        const values = [userInfo.id, req.query.ustaID]
        db.query(q,values , (error,data)=>{
         //   console.log(req.body.followedUserID)
            if(error) return res.status(500).json(error);
         //   console.log(data[0].id);
            return res.status(200).json('Order cancelled');

        })


    })

 }
 
 const getNotification = (req,res)=>{
   const token = req.cookies.accessToken;
   //console.log(token)
   if(!token) return res.status(401).json('User not logged in')
    jwt.verify(token,'ysamir',(err,userInfo)=>{
       if(err) return res.status(403).json('Token is not valid');
       

       const q = 'SELECT u.username , u.id AS USERID , u.profilePIC , o.isAccepted FROM users AS u JOIN orders AS o ON u.id = o.personalID WHERE o.ustaID = ?;';
       const values = [userInfo.id]
       db.query(q,values , (error,data)=>{
        //   console.log(req.body.followedUserID)
           if(error) return res.status(500).json(error);
        //   console.log(data[0].id);
           return res.status(200).json(data);

       })


   })



 }


 const setAccepted = (req,res)=>{

   const token = req.cookies.accessToken;
   //console.log(token)
   if(!token) return res.status(401).json('User not logged in')
    jwt.verify(token,'ysamir',(err,userInfo)=>{
       if(err) return res.status(403).json('Token is not valid');
       

       const q = 'UPDATE orders SET isAccepted = 1 WHERE personalID = ? AND ustaID = ?';
       const values = [req.body.personalID,userInfo.id]
       db.query(q,values , (error,data)=>{
        //   console.log(req.body.followedUserID)
           if(error) return res.status(500).json(error);
        //   console.log(data[0].id);
           return res.status(200).json('Order accepted');

       })


   })


 }

 const declineOrder = (req,res)=>{

   const token = req.cookies.accessToken;
   //console.log(token)
   if(!token) return res.status(401).json('User not logged in')
    jwt.verify(token,'ysamir',(err,userInfo)=>{
       if(err) return res.status(403).json('Token is not valid');
       

       const q = 'DELETE FROM orders WHERE personalID = ? and ustaID = ?';
       const values = [req.query.personalID, userInfo.id]
       db.query(q,values , (error,data)=>{
        //   console.log(req.body.followedUserID)
           if(error) return res.status(500).json(error);
        //   console.log(data[0].id);
           return res.status(200).json('Order cancelled');

       })


   })

}

    module.exports ={getOrders,makeOrder,deleteOrder,getNotification,setAccepted,declineOrder,getVerified}

