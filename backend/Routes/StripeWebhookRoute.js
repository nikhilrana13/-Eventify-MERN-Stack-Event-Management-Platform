import express from "express"
import {  stripeWebhook } from "../Controllers/BookingController.js"
import bodyParser from "body-parser"
const router = express.Router()

// routes

router.post("/stripe/webhook",bodyParser.raw({type:"application/json"}),stripeWebhook)


export default router

