import { Host } from "../Models/UserModel.js"
import cloudinary from "../Config/Cloudinary.js"
import { Response } from "../utils/ResponseHandler.js"



export const UpdateHostProfile = async(req,res)=>{
    try {
        const hostId = req.user 
        const {fullname,Address,PhoneNumber,City,Country} = req.body
        const file = req.file
        const host = await Host.findById(hostId)
        if(!host){
            return Response(res,400,'host not found')
        }
        let profilepicurl = host.profilepic
        if(file){
                   // convert image into base64
                     const imagebase64 = `data:${file.mimetype};base64,${file.buffer.toString(
                       "base64"
                     )}`;
                     // upload to cloudinary
                     const cloudinaryResponse = await cloudinary.uploader.upload(imagebase64, {
                       folder: "eventify-website",
                       resource_type: "image",
                     });
                        // get the secure url of the uploaded image
                         profilepicurl = cloudinaryResponse.secure_url
        }
        const updatedHost = await Host.findByIdAndUpdate(hostId,{fullname,profilepic:profilepicurl,Address,PhoneNumber,City,Country },{new:true})
        return Response(res,200,'profile updated successfully',updatedHost)
    } catch (error) {
        console.log("failed to update host profile",error)
        return Response(res,500,'Internal server error') 
    }
}