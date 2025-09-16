import express from "express"
import multer from "multer"
import { isHost } from "../Middlewares/isHost.js";
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import { UpdateHostProfile } from "../Controllers/HostController.js";
const router = express.Router()


 // multer config
const storage  = multer.memoryStorage();
const upload = multer({storage:storage})

// routes 
router.put("/update-host-profile",upload.single("profilepic"),isAuthenticated,isHost,UpdateHostProfile)

export default router