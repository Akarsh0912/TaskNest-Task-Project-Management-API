import express from "express"
import {auth} from "../middlewares/auth.middleware.js"
import {
    createTask,
    updateTaskStatus,
    getTaskByProjectId,
    deleteTask,
    addFollower,
    removeFollower,
    getTaskByTag,
    getFilteredTasks
    
} from "../controllers/task.controller.js"

const router =  express.Router();

router.route("/create-task").post(auth,createTask);
router.route("/update-status/:taskId").patch(auth,updateTaskStatus);
router.route("/get-task/:projectId").get(auth,getTaskByProjectId);
router.route("/delete-task/:taskId").delete(auth,deleteTask);
router.route("/:taskId/follow").patch(auth,addFollower);
router.route("/:taskId/unfollow").patch(auth,removeFollower);
router.route("/get-task").get(auth,getTaskByTag);
router.route("/get-filtered-task").get(auth,getFilteredTasks);

export default router