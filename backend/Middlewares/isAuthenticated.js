import { Response } from "../utils/ResponseHandler.js";
import jwt from "jsonwebtoken"

export const isAuthenticated = async(req,res,next)=>{
     const authHeader = req.headers.authorization;
    //  console.log(authHeader)
     if(!authHeader || !authHeader.startsWith("Bearer ")){
        return Response(res,401,"Unauthorized or invalid token")
     }
    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        // console.log("jwt key",process.env.JWT_SECRET_KEY)
        req.user = decoded.id
        // for attendee or host
        req.role = decoded.role
        next()
    } catch (error) {
        console.log("failed to verify token",error)
        return Response(res,401,"Error in Authentication middleware")
    }
}