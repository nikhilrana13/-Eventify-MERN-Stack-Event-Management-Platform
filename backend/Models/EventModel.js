import mongoose from "mongoose";

 const EventSchema =  new mongoose.Schema({
    hostId:{type:mongoose.Schema.Types.ObjectId,ref:"Host"},
    title:{type:String,required:true},
    category:{type:String,enum:["Cultural&Arts","Educational&Business","Food&Drink","Sports&fitness","Technology&Innovation","Travel&Adventure","Entertainment"]},
    description:{type:String,required:true},
    image:{type:String,required:true},
    location:{type:String,required:true},
    date:{type:Date,required:true},
    starttime:{type:String,required:true},
    endtime:{type:String,required:true},
    capacity:{type:Number,required:true},
    tickets:[{
    type:{type:String,enum:["Standard","Vip","free"]},
    price:{type:Number,required:true,default:0},
     quantity:{type:Number,required:true}
    }],
  status: { 
  type: String, 
  enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], 
  default: "Upcoming"
}
},{timestamps:true})
// Indexes for fast searching/filtering
EventSchema.index({ category: 1 }),
EventSchema.index({ date: 1 })
EventSchema.index({ location: "text" });

export const Event = mongoose.model("Event",EventSchema)

