import express from "express"
import { auth } from "../middlewares/auth.middleware.js"
import {
    register,
    login,
    logout,
    sendOtpForReset,
    resetPasswordWithOtp
} from "../controllers/auth.controller.js"

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

//secures route
router.route("/logout").post(auth,logout)
router.route("/forgot-password").post(auth,sendOtpForReset);
router.route("/reset-password").post(auth,resetPasswordWithOtp);

export default router