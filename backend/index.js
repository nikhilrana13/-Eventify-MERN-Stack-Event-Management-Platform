import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AuthRoute from "./Routes/AuthRoute.js"
import EventRoute from "./Routes/EventRoute.js"
import BookingRoute from "./Routes/BookingRoute.js"
import WebhookRoute from "./Routes/StripeWebhookRoute.js"
import HostRoute from "./Routes/HostRoute.js"
import AttendeeRoute from "./Routes/AttendeeRoute.js"
import { StartEventStatusUpdater } from "./Jobs/EventStatusUpdater.js";


dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// stripe webhook 
app.use("/api/v1",WebhookRoute)

// middlewares
app.use(cors(
    {
        origin:process.env.FRONTEND_URL,
        credentials:true
    }
));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// routes
app.use("/api/v1/auth",AuthRoute)
app.use("/api/v1/event",EventRoute)
app.use("/api/v1/Booking",BookingRoute)
app.use("/api/v1/host",HostRoute)
app.use("/api/v1/attendee",AttendeeRoute)
// app.use("/api/v1/Booking",BookingRoute)

// connect to db
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("connected to db")
}).catch((error)=>{
    console.log("failed to connect to db",error)
})



app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
    StartEventStatusUpdater()
})



