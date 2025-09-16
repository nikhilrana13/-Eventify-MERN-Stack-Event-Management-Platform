import express from "express"
import multer from "multer"
import { isHost } from "../Middlewares/isHost.js";
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import { UpdateUserProfile } from "../Controllers/AttendeeController.js";
import { isAttendee } from "../Middlewares/isAttendee.js";
const router = express.Router()


 // multer config
const storage  = multer.memoryStorage();
const upload = multer({storage:storage})

// routes 
router.put("/update-profile",upload.single("profilepic"),isAuthenticated,isAttendee,UpdateUserProfile)

export default router