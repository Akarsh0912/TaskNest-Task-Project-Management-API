import express from "express"
import {
    getAuditTrail
 } from "../controllers/audit.controller.js"
 import {auth} from "../middlewares/auth.middleware.js"

 const router = express.Router();

 router.use(auth);

 router.route("/:taskId").get(getAuditTrail)


 export default router;