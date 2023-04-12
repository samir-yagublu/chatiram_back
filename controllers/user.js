//const { restart } = require('nodemon');
const db = require('../connect.js');
const jwt = require('jsonwebtoken');
const joi = require('joi');


const searchSchema = joi.object({

    searched: joi.string().regex(/^[a-zA-Z][a-zA-Z0-9]*$/).min(3).max(15).required().required().messages({
        'string.pattern.base': 'You should only enter usernames',
      })
  
  
  })


const getUser =(req,res) =>{

    const userID = req.params.userID;
    const q = 'SELECT * FROM users WHERE id = ?';

    db.query(q,[userID],(err,data)=>{
        if(err) return res.status(500).json(err);

        if(data == null) return res.status(500);

        if(data[0] == undefined)  return res.status(500);
        const {password, ...info} = data[0];
        return res.status(200).json(info);


    })
    

}

const updateUsers = (req,res)=>{

    const token = req.cookies.accessToken;
    //console.log(token)
    if(!token) return res.status(401).json('User not logged in')
     jwt.verify(token,'ysamir',(err,userInfo)=>{
        if(err) return res.status(403).json('Token is not valid');
        

        const q = 'UPDATE users SET username = ? , name = ? , phone = ? , job = ? , profilePic = ? WHERE id = ?';
        const values  =  [req.body.username, req.body.name, req.body.phone,
            req.body.job, req.body.profilePic, userInfo.id
        ]
       
        db.query(q, values , (error,data)=>{
            if(error) return res.status(500).json(error);
            //console.log(data);
            if(data.affectedRows > 0) return res.status(200).json('User has been edited');
            return res.status(403).json('Only update your profile')

        })


    })


}


const searchUser = (req,res)=>{

    const {error , value } = searchSchema.validate(req.query , {abortEarly:false })
    
    if(error) { if(error.length) { error.details.map( e=> e.message  )  }
    else{return res.status(500).json(error.message)}  }    

    const q = 'SELECT * FROM users WHERE LOWER(username) LIKE LOWER(?);'
    db.query(q,['%' + req.query.searched + '%'], (err,data)=>{
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);


    })

}

module.exports = {getUser,updateUsers,searchUser};