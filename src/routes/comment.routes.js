import express from "express"
import { auth } from "../middlewares/auth.middleware.js"
import {
    addComment,
    getCommentByTaskId,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js"

const router = express.Router();

router.route("/add-comment/:taskId").post(auth,addComment);
router.route("/get-comment/:taskId").get(auth,getCommentByTaskId);
router.route("/update-comment/:commentId").patch(auth,updateComment);
router.route("/delete-comment/:commentId").delete(auth,deleteComment);


export default router