import { Response } from "../utils/ResponseHandler.js"

export const isHost = async(req,res,next)=>{
    try {
        if(!req.role || req.role !== "Host"){
            return Response(res,401,"Only Host can access this route")
        }
        next()
        
    } catch (error) {
        console.log("failed to verify host",error)
        return Response(res,401,"Error in Host middleware")
    }
}

