import {User} from "../Models/UserModel.js"
import { Attendee } from "../Models/UserModel.js"
import { Host } from "../Models/UserModel.js"
import { Response } from "../utils/ResponseHandler.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



export const HandleSignup = async(req,res)=>{
    try {
        const {fullname,email,password,role} = req.body
        console.log("req.body",req.body)
        if(!fullname || !email || !password || !role){
            return Response(res,400,"All fields is required")
        }

        // check if user exists already
        const ExistingUser = await User.findOne({email})
        if(ExistingUser){
            return Response(res,404,"User Exists Already")
        }
        // hash password
        const hashpassword = await bcrypt.hash(password,10)
        // create user
        let newUser ;
        if(role === "Attendee"){
            newUser = await Attendee.create({
                fullname,email,password:hashpassword,role
        })
    }
      if(role === "Host"){
            newUser = await Host.create({
                fullname,email,password:hashpassword,role
            })
        }
      return Response(res,200,"Sign Up Successfully",{user:newUser})
    } catch (error) {
        console.log("failed to Sign Up",error)
        return Response(res,500,"Internal Server error")
    }
}
export const HandleSignIn = async(req,res)=>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            return Response(res,404,"All fields is required")
        }
        // check if user exists or not
        const user = await User.findOne({email})
        if(!user){
            return Response(res,400,"User not found")
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return Response(res,401,"Invalid Credentials")
        }
        // generate token
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
        res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"})
        return Response(res,200,"SignIn Successfully",{user,token})
    } catch (error) {
        console.log("failed to Sign In",error)
        return Response(res,500,"Internal Server error")
    }
}

export const HandleSignOut = async(req,res)=>{
  try {
    res.clearCookie("token",{httpOnly:true,secure:true,sameSite:"none"},)
    return Response(res,200,"Sign Out Sucessfully")

  } catch (error) {
      console.log("failed to Signout",error)
      return Response(res,500,"Internal Server error")
  }
}


