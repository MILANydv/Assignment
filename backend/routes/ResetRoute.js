import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import SendEmail from "../SendEmail.js";
import bcrypt from "bcryptjs";
import Token from "../models/TokenModel.js";


const ResetRouter = express.Router();


ResetRouter.post("/reset-password", async(req,res) =>{



    const email = req.body.email;
    User.findOne({
        
    })
})