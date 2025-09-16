import { Booking } from "../Models/BookingModel.js"
import { Event } from "../Models/EventModel.js"
import { Host, User } from "../Models/UserModel.js"
import { SendBookingDetails } from "../Services/EmailService.js"
import { Response } from "../utils/ResponseHandler.js"
import { StripeInstance } from "../utils/Stripe.js"

export const BookEvent = async(req,res)=>{
    try {
        const userId = req.user 
        const {eventId,tickettype,quantity} = req.body
        // console.log("req.body",req.body)
        // check user exist or not
        const user = await User.findById(userId)
        if(!user){
            return Response(res,404,"user not found or you are not authorized to book the Event ")
        }
        if(user.role === "Host"){
            return Response(res,404,"You are not authorized to Book event")
        }
        // check event exist or not
        const event = await Event.findById(eventId)
        if(!event){
            return Response(res,404,"Event not found")
        }
        // check ticket type
        const ticket = event.tickets.find((t)=> t.type === tickettype)
        if(!ticket){
            return Response(res,400,"Invalid Ticket type")
        }
        // check event capacity with ticket quantity
        const bookedAgg = await Booking.aggregate([
          {$match:{eventId:event._id}},
          {$group:{_id:null,totalQuantity:{$sum:"$quantity"}}}
        ])
        const totalBooked = bookedAgg.length > 0 ? bookedAgg[0].totalQuantity : 0;
        if(totalBooked + quantity > event.capacity){
           return Response(res,400,"Event is sold out or not enough seats left!")
        }
        // const bookingCount = await Booking.countDocuments({eventId:eventId})
        // if(bookingCount >= event.capacity){
        //   return Response(res,400,"Event is sold out!")
        // }
        // checked booking already exists
        const existingBooking = await Booking.findOne({eventId,userId})
        if(existingBooking){
          return Response(res,400,"You have already booked this event")
        }
        // calculate total price
        let amount = ticket.price * quantity 
        if(tickettype === "free") amount = 0
        // create booking
        const booking = await Booking.create({
            eventId,
            userId,
            tickettype,
            quantity,
            amount,
            paymentStatus: amount === 0 ? "Success":"Pending",
            stripePaymentId: "temp_12345",
        })
        // push booking id to user bookedEvents array
        user.bookedEvents.push(booking._id)
        await user.save()
        await booking.save()
        if(amount === 0){
            return Response(res,200,"booking successful",booking)
        }
    // Stripe Checkout Session
    const session = await StripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: event.title,
              description: `Ticket: ${tickettype}`,
            },
            unit_amount: ticket.price * 100, // in paise
          },
          quantity,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed?bookingId=${booking._id}`,
      metadata:{
        bookingId:booking._id.toString(),
        userId:user._id.toString(),
        eventId
      }
    });
    //  console.log("Payment successful:", session);
    return Response(res,200,"Booking sucessfully",{url:session.url,booking})
    } catch (error) {
        console.error("failed to book event",error)
        return Response(res,500,"Internal Server error")
    }
}
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let stripeEvent;
  try {
    stripeEvent = StripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
      console.error("Webhook Error:", err.message);
    return Response(res,400,`Webhook Error: ${err.message}`);
  }
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const bookingId = session.metadata.bookingId;
    const userId = session.metadata.userId
    const eventId = session.metadata.eventId
    const booking = await Booking.findById(bookingId);
    // console.log("booking fetched for booking detail sending:", booking);
    const user = await User.findById(userId)
    // console.log("User fetched for email sending:", user);
    const event = await Event.findById(eventId)
    // console.log("event fetched for event sending:",event);
    if (booking && user && event) {
      booking.paymentStatus = "Success";
      booking.stripePaymentId = session.payment_intent;
      await SendBookingDetails(user,booking,event)
      await booking.save();
       console.log("Booking updated successfully!",booking);
    }else{
      console.warn(" Booking not found with ID:", bookingId);
    }
  }
  res.json({ received: true });
};

// attendee booking function
export const EachUserBookings = async(req,res)=>{
  try {
       const userId = req.user 
       const user = await User.findById(userId)
       if(!user){
        return Response(res,404,"User not found")
       }
       const bookings = await Booking.find({userId:userId}).populate("eventId","title location date starttime endtime image status")
       if(!bookings){
        return Response(res,404,"No Bookings found")
       }
       return Response(res,200,"Bookings found",bookings)
  } catch (error) {
    console.error("failed to get bookings",error)
    return Response(res,500,"Internal Server error")
  }
}
// host bookings function
export const HostBookings = async(req,res)=>{
  try {
    const hostId = req.user 
    const host = await Host.findById(hostId)
      if(!host){
        return Response(res,404,"Host not found")
       }
    // find host events
    const events = await Event.find({hostId:hostId}).select("_id title location date startime endtime image status")
    if(!events || events.length === 0){
      return Response(res,404,"No events found for this host")
    }
    // find all eventIds
    const eventIds = events.map((e => e._id))
    // find bookings of host 
    const bookings = await Booking.find({eventId:{$in:eventIds}}).populate("userId","name email").populate("eventId","title location date starttime endtime image status")

    if(!bookings || bookings.length === 0){
      return Response(res,404,"No bookings found for host’s events")
    }
    return Response(res,200,"Bookings found",bookings)
  } catch (error) {
    console.error("failed to get bookings",error)
    return Response(res,500,"Internal Server error")
  }
}
export const FindTotalRevenue = async(req,res)=>{
  try {
     const hostId = req.user 
     const host = await Host.findById(hostId)
     if(!host){
      return Response(res,404,"Host not found")
     }
    // get all events of host 
     const events = await Event.find({hostId:hostId}).select("_id title location date starttime endtime image status")
    if(!events || events.length === 0){
      return Response(res,404,"No events found for this host")
    }
    // find all eventIds
    const eventIds = events.map((e => e._id)) 
    // find success status bookings 
    const bookings = await Booking.find({eventId:{$in:eventIds},paymentStatus:"Success"}).select("amount")
    // calculate total revenue
    const totalRevenue = bookings.reduce((sum,booking)=> sum + booking.amount,0)
    const totalEvents = events.length
    const totalBookings = bookings.length 
    return Response(res,200,"Total Bookings and revenue found successfully",{totalRevenue,totalBookings,totalEvents})
  } catch (error) {
      console.log("failed to get revenue", error);
    return Response(res, 500, "internal server error");
  }
}

// for only testing 
export const UpdatePaymentStatus = async(req,res)=>{
  try {
       const userId = req.user 
       const bookingId = req.params.id
      const user = await User.findById(userId)
     if(!user){
      return Response(res,404,"User not found")
     }
     // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return Response(res, 400, "Booking not found");
    }
    // Update status
    booking.paymentStatus = "Success";
    await booking.save();
    // Fetch event
    const event = await Event.findById(booking.eventId);
    // Send email 
    if (event) {
      await SendBookingDetails(user, booking, event);
    }
    return Response(res, 200, "Payment Successfully", booking);
  } catch (error) {
    console.log("failed to update payment status",error)
    return Response(res,500,"Internal server error")
  }
}
// for only testing
export const UpdateCancelPaymentStatus = async(req,res)=>{
  try {
       const userId = req.user 
       const bookingId = req.params.id
      const user = await User.findById(userId)
     if(!user){
      return Response(res,404,"User not found")
     }
     // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return Response(res, 400, "Booking not found");
    }
    // Update status
    booking.paymentStatus = "Failed";
    await booking.save();
    return Response(res, 200, "Payment failed", booking);
  } catch (error) {
    console.log("failed to update payment status",error)
    return Response(res,500,"Internal server error")
  }
}

