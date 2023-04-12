const db = require('../connect.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
const { v4: uuidv4 } = require('uuid');





const joi = require('joi');
const registerSchema = joi.object({

    name: joi.string().min(3).max(15).regex(/^[a-zA-Z]+$/).required(),
    email : joi.string().trim().email().required(),
    username : joi.string().regex(/^[a-zA-Z][a-zA-Z0-9]*$/).min(3).max(15).required(),
    password : joi.string().min(8).max(30).regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/).required().messages({
        'string.pattern.base': 'Password should contain numbers, character and special character',}),
    phone : joi.allow(),
    account_type : joi.allow(),
    job : joi.allow()
});

const loginSchema = joi.object({

  email_username: joi.string().regex(/^(?=.*[a-zA-Z0-9])(?:[a-zA-Z0-9]+[_-])*[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,})$|^[a-zA-Z0-9]{1,20}$/).required().messages({
    'string.pattern.base': 'It can be email or valid username',
  }),
  password: joi.string().required(),

})


    

const register =  (req,res) =>{
    
    const {error , value } = registerSchema.validate(req.body , {abortEarly:false })
   
    if(error) { error.details.map( (e)=> { return res.status(500).json(e.message) }
        
    )
    
    //return res.status(500).json(errors); 
    
}
    else{
   
    const q = 'SELECT * FROM users WHERE username = ? OR email = ? ';
    db.query(q,[req.body.username, req.body.email], (err,data)=>{

        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json('User already exists');

        //CREATE NEW USER
        const salt = bcrypt.genSaltSync(10);
        const hashedpassword = bcrypt.hashSync(req.body.password,salt);
        const verificationToken = uuidv4();
        const ustaValues = [req.body.username,req.body.name,req.body.email,hashedpassword,req.body.job,req.body.account_type,verificationToken];
        //const personalValues = [req.body.username,req.body.name,req.body.email,hashedpassword,req.body.account_type];
       
            const q = 'INSERT INTO users( username, name,email,password,job,type,vToken) VALUE (?)';
            db.query(q,[ustaValues] , (err,data) =>{
                if(err) return res.status(500).json(err);
                const mailOptions = {
                    from: 'samir.yyaqublu@gmail.com',
                    to: `${req.body.email}`,
                    subject: 'Please verify your email address',
                    html: `<p>Click this <a href="${process.env.APP_HOST}/api/auth/verify/${verificationToken}">link</a> to verify your email address</p>`
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                return res.status(200).json('User create successfully')


            });

    });


}    }


const verify = (req,res)=>{

const { token } = req.params;
console.log(token)
const q = 'SELECT * FROM users WHERE vToken = ? ';

db.query(q,token,(err,result)=>{
  
  if(err) return res.status(500).json(err);
  if(result.length == 0) return res.status(500).json('Wrong token')
  
  const user = result[0];
  console.log(user)
  if(user.isVerified == 1){
    console.log('isverified bitdi');
    return res.status(500).json('Email is already verified');
   
  }
  else if(user.isVerified == 0){
  
      if(result.length == 0){
        console.log('wrong token sonra return')
       return res.status(500).json('Wrong tokens');
      }
      else{
        const query = 'UPDATE users SET isVerified = 1 WHERE id = ? ';
        db.query(query,user.id,(error,data)=>{
          
          if(error) return res.status(500).json(error);
          console.log('successfull mesage')
          return res.status(200).json('Email has been verified successfully')
          

        })

      }  
}

})


}


const login = (req,res) =>{

  const {error , value } = loginSchema.validate(req.body , {abortEarly:false })
  
  if (error) {
    const errors = error.details.map(e => e.message);
    return res.status(500).json(errors);
  }
  
  //return res.status(500).json(errors); 
  

     

  else {


        const q = 'SELECT * FROM users WHERE username = ? or email = ? ' ; 
        db.query(q,[req.body.email_username,req.body.email_username], (err,data)=>{
        //  console.log('backend db query den sonra')
            if(err) return res.status(500).json(err);
          //  console.log('error olmasa')
            if(data.length == 0 ) return res.status(404).json('User not found');

            const isVerified = data[0].isVerified;
            if(isVerified ==0){
              return res.status(500).json('Please verify email address');
            }

            else if(isVerified == 1){
            const checkPassword = bcrypt.compareSync(req.body.password,data[0].password);
            if(!checkPassword) return res.status(400).json('Wrong password!');
            const token = jwt.sign({
                id:data[0].id } , "ysamir");

                const {password, ...others} = data[0];  //passworddan basqa fielddari goturur
                res.cookie("accessToken", token,  {
                    httpOnly: true,

                }).status(200).json(others)
              }
        })  
    

}   
}

const logout = (req,res)=>{

    res.clearCookie("accessToken",{
        secure:true,
        sameSite: "none" //backedn nen fronted portlari basqa oldugu ucun

    }).status(200).json("User has been logged out")

}





module.exports = {login,register,logout,verify};