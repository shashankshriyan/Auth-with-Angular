const express=require('express');
const cors=require('cors');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');
const dotenv=require("dotenv")
dotenv.config();
const User=require("./models/User");

const app=express();
const PORT=3000;


app.use(cors());
app.use(express.json())

// ,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// }

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("Connected Successfully");
}).catch((err)=>{
    console.log("mongodb connection error",err)
})


app.listen(PORT,()=>{
    console.log(`server is running in the port ${PORT}`)
})


app.post('/api/signup', async(req,res)=>{
   try{
     const {email,password}=req.body;
    const existingUser= await User.findOne({email})
    if(existingUser){
        return res.status(500).json({message:"User already exists"});
    }
    const hashedPassword= await bcrypt.hash(password,10);
    const newUser=new User({
        email,
        password:hashedPassword
    })
    await newUser.save();

    res.status(201).json({message:"User registered Successfully"});
   }
   catch(error){
    console.log("error during signup");
    res.status(500).json({message:"server error during signup"});

   }
})

app.post('/api/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(500).json({message:"user not found"})
        }

        const passwordMatch= await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(500).json({message:"wrong password"})

        }
        
       const token = jwt.sign({ userId: user._id,email:user.email }, process.env.JWT_SECRET, {
       expiresIn: '1h',
       });

       res.status(201).json({
        token,
        user:{
            userId:user._id,
            email:user.email,

        }
       })


    }
    catch(error){
         console.log("error during login");
         res.status(500).json({message:"server error during login"});
    }
})

function authenticateToken(req,res,next){
    const authHeader=req.headers["authorization"]
    console.log(authHeader)
   
     const token=authHeader && authHeader.split(" ")[1];
  
    // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQxODVkYmQ3NjQ0MDk5NDIyOGFkYzIiLCJlbWFpbCI6InNoYXNoYW5rQGdtYWlsLmNvbSIsImlhdCI6MTc0OTE4ODg1NywiZXhwIjoxNzQ5MTkyNDU3fQ.kuHxQC5dUdo8MXmchDpXKXug1tGtMzbqdx1SwXj3UTc"
     console.log("token",token)
    if(!token){
        res.status(401).json({message:"No token provided,authentication denied"});

    }
  
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        console.log(req.user)
        next() ;

    }
    catch(error){
         res.status(403).json({message:"Invalid or expired token"});

    }
}

app.get('/api/profile',authenticateToken,async (req,res)=>{
    try{
        const userId=req.user.userId;
        
        const user=await User.findById(userId).select('-password');
        if(!user){
              return res.status(404).json({message:"user not found"});
        }
        return res.json({user})

    }
    catch(error){
        console.log("error fetching profile",error)
          res.status(500).json({message:"Server error"});

    }
})
