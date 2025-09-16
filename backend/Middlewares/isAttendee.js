import { Response } from "../utils/ResponseHandler.js"

export const isAttendee = async(req,res,next)=>{
    try {
        if(!req.role || req.role !== "Attendee"){
            return Response(res,401,"Only Attendee can access this route")
        }
        next()
        
    } catch (error) {
        console.log("failed to veriy Attendee",error)
        return Response(res,401,"Error in Attendee middleware")
    }
}