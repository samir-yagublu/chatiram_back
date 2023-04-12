const express = require('express');
const app = express();

const userRoutes = require('./routes/users.js');
const postRoutes = require('./routes/posts.js');
const likesRoutes = require('./routes/likes.js');
const commentsRoutes = require('./routes/comments.js');
const authRoutes = require('./routes/auth.js');
const storyRoutes = require('./routes/stories.js')
const relationRoutes = require('./routes/relationships.js')
const orderRoutes = require('./routes/orders');
const locationRoutes = require('./routes/locations');
const multer = require('multer')
require('dotenv').config()
const cors = require('cors'); //cors onun ucundiki api ya yalniz localhost dan reach ede biler other url will be blocked
const cookieParser = require('cookie-parser');
const PORT = 8800;
app.use(express.json());

app.use(cookieParser());
app.use((req,res,next) =>{ 
        
    // Website you wish to allow to connect
res.setHeader('Access-Control-Allow-Origin',process.env.APP_CLIENT );

// Request methods you wish to allow
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// Request headers you wish to allow
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
res.setHeader('Access-Control-Allow-Credentials', true);

// Pass to next layer of middleware
next();

})

app.use(cors({
    origin: process.env.APP_CLIENT  //client 
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../chatiram/public/client')
    },
    filename: function (req, file, cb) {
      
      cb(null, Date.now() + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  app.post('/api/upload',upload.single('file'),(req,res)=>{
  
    const file = req.file;
    res.status(200).json(file.filename);

  })
  app.post('/api/upload/story',upload.single('filen'),(req,res)=>{
    //console.log(file);
    const file = req.file;
    res.status(200).json(file.filename);

  })

  app.use('/api',locationRoutes);
  app.use('/api', relationRoutes);
  app.use('/api', orderRoutes);
  //app.use('/api',relationRoutes);
app.use('/api',userRoutes);
app.use('/api',storyRoutes);
app.use('/api',likesRoutes);
app.use('/api',commentsRoutes);
app.use('/api',postRoutes);
app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);

app.listen(process.env.PORT || PORT, ()=> {
  
    console.log('api working')

} )

