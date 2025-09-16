import mongoose from "mongoose";

const BookingSchema = mongoose.Schema({
    eventId:{type:mongoose.Schema.Types.ObjectId,ref:"Event",required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    tickettype:{type:String,enum:["Standard","Vip","free"],required:true},
    amount:{type:Number,required:true},
    quantity:{type:Number,required:true}, 
    paymentStatus:{type:String,enum:["Pending","Success","Failed"],default:"Pending"},
    stripePaymentId:{type:String,required:true},
},{timestamps:true})  

export const Booking =  mongoose.model("Booking",BookingSchema)
