import express from "express"
import multer from "multer"
import { CancelEvent, CreateAEvent, DeleteEvent, EachHostEvents, GetAllevents, GetEachEventDetail, UpdateEventDetails } from "../Controllers/EventController.js";
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import { isHost } from "../Middlewares/isHost.js";
const router = express.Router()

// multer config
const storage  = multer.memoryStorage();
const upload = multer({storage:storage})

// routes for host and attendee
// host route
router.post("/create-event",upload.single("image"),isAuthenticated,isHost,CreateAEvent)
router.get("/host-events",isAuthenticated,isHost,EachHostEvents)
router.put("/update-event/:id",upload.single("image"),isAuthenticated,isHost,UpdateEventDetails)
router.patch("/cancel-event/:id",isAuthenticated,isHost,CancelEvent)
router.delete("/delete/:id",isAuthenticated,isHost,DeleteEvent)
//public route
router.get("/event-details/:id",GetEachEventDetail)
router.get("/all-events",GetAllevents)

export default router