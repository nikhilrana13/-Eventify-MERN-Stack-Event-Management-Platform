import express from "express"
import {isAuthenticated} from "../Middlewares/isAuthenticated.js"
import { BookEvent, EachUserBookings, FindTotalRevenue, HostBookings, stripeWebhook, UpdateCancelPaymentStatus, UpdatePaymentStatus } from "../Controllers/BookingController.js"
import { isHost } from "../Middlewares/isHost.js"
import { isAttendee } from "../Middlewares/isAttendee.js"
const router = express.Router()

// routes for attendee
router.post("/book-event",isAuthenticated,BookEvent) 
router.get("/my-bookings",isAuthenticated,EachUserBookings)

// payment status marked
router.post("/:id/mark-success",isAuthenticated,isAttendee,UpdatePaymentStatus)
router.post("/:id/mark-failed",isAuthenticated,isAttendee,UpdateCancelPaymentStatus)
// route for host 
router.get("/host-bookings",isAuthenticated,isHost,HostBookings)
router.get("/total-revenue",isAuthenticated,isHost,FindTotalRevenue)


export default router
