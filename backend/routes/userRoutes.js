import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { isAuth, isAdmin, generateToken } from "../utils.js";
import nodemailer from "nodemailer";
// import mg from "mailgun-js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config({path: "../.env.example"})

// const MAILGUN_DOMAIN = "sandbox06084b55ac384c46b00ab8f27f23c24e.mailgun.org";
// const MAILGUN_KEY = "3858c86242b15757ced3651ba899b384-c2efc90c-f423a576";
// const mailgun = mg({ apiKey: MAILGUN_KEY, domain: MAILGUN_DOMAIN });




const userRouter = express.Router();

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
      user:"ssarthak737@gmail.com",
      pass:"yzcacryobktvfwze"

  }
}) 


userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@example.com") {
        res.status(400).send({ message: "Can Not Delete Admin User" });
        return;
      }
      await user.remove();
      res.send({ message: "User Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compare(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

// userRouter.post("/forgot-password", async(req,res) =>{
//   const { email } = req.body;

//   const user = User.findOne({ email }, (err, user) => {
//     if (err || !user) {
//       return res
//         .status(400)
//         .json({ message: 'User with this email does not exist' });
//     }

//     const token = generateToken(user);
//     const data = {
//       from: 'kkyser8@gmail.com',
//       to: email,
//       subject: 'Reset Password',
//       html: `
//       <h2>Please click on the given link to reset your password<h2>
//       <p>http://localhost:3001/reset-password/${token}</p>
//       `
//     };
    
//     return user.updateOne({ resetLink: token }, function(err, success) {
//       if (err) {
//         return res.status(400).json({ error: 'Reset password link error' });
//       } else {
//         mailgun.messages().send(data, function(error, body) {
//           if (error) {
//             return res.json({ error: error.message });
//           }
//           return res.json({
//             message: 'Email has been sent, kindly follow the instructions'
//           });
//         });
//       }
//     });
//   });


// })


// userRouter.put("/reset-password", async(req,res) =>{

//   try{
//   const { resetLink, newPass } = req.body;
//   if (resetLink) {
//     jwt.sign(resetLink,"somethingsecret", function(error, decodedData) {
//       if (error) {
//         return res.status(401).json({ message: 'Token incorrect or expired' });
//       }
//       User.findOne({ resetLink }, function(err, user) {
//         if (err || !user) {
//           return res
//             .status(400)
//             .json({ message: 'Token incorrect or expired' });
//         }
//         const obj = {
//           password: newPass,
//           resetLink: ''
//         };

//         user = Object.assign(user, obj);

//         user.save((err, result) => {
//           if (err) {
//             return res
//               .status(401)
//               .json({ error: 'Token incorrect or expired' });
//           } else {
//             res.status(200).json({ message: 'Your password has been changed' });
//           }
//         });
//       });
//     });
//   } else {
//     return res.status(401).json({ error: 'Authentication Error' });
//   }
// }
// catch(err){
//   res.status(401).json({ error: "Password did not resetted"})

// }
// })


userRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ status: 401, message: "Enter Your Email" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ status: 401, message: "Invalid user" });
    }
    const token = jwt.sign({ _id: user._id }, "somethingsecret", {
      expiresIn: "12520s"
    });
    await User.findByIdAndUpdate(
      { _id: user._id },
      { verifytoken: token },
      { new: true }
    );
    const mailOptions = {
      from: "kkyser8@gmail.com",
      to: email,
      subject: "Sending Email For password Reset",
      text: `Link:  http://localhost:3000/reset-password/${token}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error", error);
        return res
          .status(401)
          .json({ status: 401, message: "Email not sent" });
      } else {
        console.log("Email sent", info.response);
        return res
          .status(201)
          .json({ status: 201, message: "Email sent Succsfully" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

// ;ast
// userRouter.post("/forgot-password", async(req,res) =>{
//   const {email} = req.body;

//   if(!email){
//       res.status(401).json({status:401,message:"Enter Your Email"})
//   }

//   try {
//       const userfind = await User.findOne({email:email});

//       // token generate for reset password
//       const token = jwt.sign({_id:userfind._id},"somethingsecret",{
//           expiresIn:"12520s"
//       });
      
      
//       const setusertoken = await User.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true});
//       // console.log(setusertoken)

//       if(setusertoken){
//           const mailOptions = {
//               from:"kkyser8@gmail.com",
//               to:email,
//               subject:"Sending Email For password Reset",
//               text:`Link:  http://localhost:3001/reset-password/${setusertoken}`
//           }

//           transporter.sendMail(mailOptions,(error,info)=>{
//               if(error){
//                   console.log("error",error);
//                   res.status(401).json({status:401,message:"email not send"})
//               }else{
//                   console.log("Email sent",info.response);
//                   res.status(201).json({status:201,message:"Email sent Succsfully"})
//               }
//           })

//       }

//   } catch (error) {
//       res.status(401).json({status:401,message:"invalid user"})
//   }


// })



// userRouter.post("/:id/:token",async(req,res)=>{
//   const {id, token} = req.params;

//   const {password} = req.body;

//   try {
//       const validuser = await User.findOne({_id:id,verifytoken:token});
      
//       const verifyToken = jwt.verify(token,"somethingsecret");

//       if(validuser && verifyToken._id){
//           const newpassword = await bcrypt.hash(password,12);

//           const setnewuserpass = await User.findByIdAndUpdate({_id:id},{password:newpassword});

//           setnewuserpass.save();
//           res.status(201).json({status:201,setnewuserpass})

//       }else{
//           res.status(401).json({status:401,message:"user not exist"})
//       }
//   } catch (error) {
//       res.status(401).json({status:401,error})
//   }
// })

//last

// userRouter.post("/reset-password/:token", async(req,res,next)=>{
//   const user = await User.findById(req.params.id);
  
//   const {password} = req.body;
//   const newpassword = await bcrypt.hash(password,12);

//           const setnewuserpass = await User.findByIdAndUpdate({_id:id},{password:newpassword}, {new:true});
//           return res.status(200).json({
//             success:true,
//             message:"Rest Successfull",
//             user :setnewuserpass
//           })
// }
// )

userRouter.post("/reset-password/:token", async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({ verifytoken: req.params.token });
    if (!user) {
      return res.status(401).json({ status: 401, message: "Invalid token" });
    }
    const newPassword = await bcrypt.hash(password, 12);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { password: newPassword },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

export default userRouter;
