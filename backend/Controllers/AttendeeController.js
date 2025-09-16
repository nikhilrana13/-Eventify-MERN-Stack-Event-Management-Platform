import cloudinary from "../Config/Cloudinary.js"
import { Response } from "../utils/ResponseHandler.js"
import { User } from "../Models/UserModel.js"


export const UpdateUserProfile = async(req,res)=>{
    try {
        const userId = req.user 
        const {fullname} = req.body
        const file = req.file
        const user = await User.findById(userId)
        if(!user){
            return Response(res,400,'User not found')
        }
        let profilepicurl = user.profilepic
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
        const updatedUser = await User.findByIdAndUpdate(userId,{fullname,profilepic:profilepicurl},{new:true})
        return Response(res,200,'profile updated successfully',updatedUser)
    } catch (error) {
        console.log("failed to update user profile",error)
        return Response(res,500,'Internal server error') 
    }
}