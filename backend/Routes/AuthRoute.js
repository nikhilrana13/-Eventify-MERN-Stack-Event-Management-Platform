import express from "express"
import { HandleSignIn, HandleSignOut, HandleSignup } from "../Controllers/AuthController.js"
const router = express.Router()

// routes
router.post('/sign-up',HandleSignup)
router.post('/sign-in',HandleSignIn)
router.get("/sign-out",HandleSignOut)


export default router 

