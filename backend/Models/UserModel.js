import mongoose from "mongoose";


const options = {discriminatorKey:"role",timestamps:true}

// base user schema
const baseUserSchema = new mongoose.Schema({
        fullname:{type:String,required:true,trim:true},
        email:{type:String,required:true,lowercase:true},
        password:{type:String,required:true,minlength:6},
        role:{type:String,enum:["Attendee","Host"],default:"Attendee"},
        profilepic:{type:String,default:""}
},options
)
export const User = mongoose.model("User",baseUserSchema)

// attendee Schema 
const attendeeSchema= new mongoose.Schema({
        bookedEvents:[{type:mongoose.Schema.Types.ObjectId,ref:"Event",default:[]}], // for attendee to store her bookedevents 
})

export const Attendee = User.discriminator("Attendee",attendeeSchema)
// host schema
const hostSchema = new mongoose.Schema({
        PhoneNumber:{type:String,default:""}, // only for host 
         Address:{type:String,default:""}, // only for host
         City:{type:String,default:""},
         Country:{type:String,default:""},
        MyEvents:[{type:mongoose.Schema.Types.ObjectId,ref:"Event",}], // only for host to store her create events
})
export const Host = User.discriminator("Host",hostSchema)
