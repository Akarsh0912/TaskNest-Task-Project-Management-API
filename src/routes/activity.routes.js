import express from "express"
import {
    getActivityForTask,
    getAllProjectsActivity
} from "../controllers/activity.controller.js"
import {auth} from "../middlewares/auth.middleware.js" 


const router = express.Router();

router.use(auth);

router.route('activity/:taskId').get(getActivityForTask);
router.route("/activity/admin").get(getAllProjectsActivity);

export default router


