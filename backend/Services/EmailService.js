import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.PASS_USER,
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log("Gmail services connection failed")
    }else{
        console.log("Gmail configured properly and ready to send email")
    }
})

export const SendBookingDetails = async(user,booking,event)=>{
    // console.log(" Sending email to:", user.email);  // Debugging
  if (!user?.email) {
    throw new Error("User email not found!");
  }
const html =
 `
   <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width:650px; margin:20px auto; border:1px solid #e0e0e0; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4CAF50,#2E7D32); padding:20px; text-align:center; color:white;">
      <h1 style="margin:0; font-size:24px;">🎉 Booking Confirmed!</h1>
      <p style="margin:5px 0 0; font-size:14px;">Your payment was successful</p>
    </div>
    <!-- Body -->
    <div style="padding:25px; background:#fafafa;">
      <p style="font-size:16px;">Hi <b>${user.fullname}</b>,</p>
      <p style="font-size:15px; color:#555;">Thank you for booking your ticket with <b>Eventify</b>. Below are your booking and event details:</p>
      <!-- Event Card -->
      <div style="background:white; border:1px solid #eee; border-radius:8px; padding:15px; margin:20px 0;">
        <h2 style="margin-top:0; font-size:18px; color:#333; border-bottom:1px solid #eee; padding-bottom:8px;">📅 Event Details</h2>
        <p><b>Title:</b> ${event.title}</p>
        <p><b>Location:</b> ${event.location}</p>
        <p><b>Date:</b> ${new Date(event.date).toLocaleDateString()}</p>
        <p><b>Time:</b> ${event.starttime} - ${event.endtime}</p>
        <img src="${event.image}" alt="Event Image" style="width:100%; max-height:220px; object-fit:cover; border-radius:6px; margin-top:10px;"/>
      </div>
      <!-- Ticket Card -->
      <div style="background:white; border:1px solid #eee; border-radius:8px; padding:15px;">
        <h2 style="margin-top:0; font-size:18px; color:#333; border-bottom:1px solid #eee; padding-bottom:8px;">🎟️ Ticket Details</h2>
        <p><b>Booking ID:</b> ${booking._id}</p>
        <p><b>Tickets:</b> ${booking.quantity}</p>
        <p><b>Total Price:</b> ₹${booking.amount}</p>
        <p><b>Payment Status:</b> ✅ ${booking.paymentStatus}</p>
      </div>
      <p style="margin-top:25px; font-size:15px; color:#444;">We look forward to seeing you at the event 🎊</p>
      <p style="margin:5px 0 0; font-size:14px; color:#777;">Best Regards,<br/> <b>Eventify Team</b></p>
    </div>
    <!-- Footer -->
    <div style="background:#f1f1f1; padding:12px; text-align:center; font-size:12px; color:#888;">
      © ${new Date().getFullYear()} Eventify. All rights reserved.
    </div>
  </div>
  `;
  await transporter.sendMail({
    from:`Eventify <${process.env.EMAIL_USER}>`,
    to:user.email,
    subject:'Your Booking and Event Details',
    html,
  })
}






