import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { commentValidation } from "../validations/commentValidation.js"
import mongoose from "mongoose"
import { Activity } from "../models/activity.model.js"


//ADD COMMENT
export const addComment = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { commentText } = req.body;

    commentValidation({ taskId, commentText });

    const comment = await Comment.create({
        taskId: taskId,
        text: commentText,
        user: req.user.id,
    })

    if (!comment) {
        throw new ApiError(500, "Comment Creation failed. Server Error")
    }

    //log comment add activity
    await Activity.create({
        task: taskId,
        user: req.user.id,
        action: 'commented',
        message: `Commented: "${commentText.slice(0, 50)}"`
    })

    return res.status(201).json(new ApiResponse(true, 201, "Comment added successfully", comment))
});

//GET COMMENT BY  TASK ID 
export const getCommentByTaskId = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json(new ApiResponse(false, 400, "Task ID is invalid"));
    }

    const comments = await Comment.find({ taskId: taskId }).populate("user", "name").sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(true, 200, "Comments Fetched Successfully", comments));

});

//UPDATE COMMENT
export const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { updatedComment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json(new ApiResponse(false, 400, "Invalid Comment Id"))
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        return res.status(400).json(new ApiResponse(false, 400, "Comments Not Found"))
    }

    const commentUser = comment.user.toString();

    if (commentUser !== req.user.id) {
        return res.status(400).json(new ApiResponse(false, 400, "Only Creator of the comment can update"))
    }

    comment.text = updatedComment;
    await comment.save();

    return res.status(200).json(new ApiResponse(true, 200, "Comment Updated Successfully", comment));
});

// DELETE COMMENT 
export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json(new ApiResponse(false, 400, "Invalid Comment Id"))
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        return res.status(400).json(false, 400, "Comment Not Found");
    }
    const commentUser = comment.user.toString();

    if (commentUser !== req.user.id) {
        return res.status(400).json(false, 400, "Only Creator of the comment can delete the comment")
    }

    await Comment.deleteOne({ _id: commentId });
    return res.status(200).json(new ApiResponse(true, 200, "Comment Deleted Successfully"));
});


