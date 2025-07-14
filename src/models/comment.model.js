import mongoose from "mongoose";
import {Task} from "./task.model.js"
import {Project} from "./project.model.js"
import {User} from "./user.model.js"

const commentSchema = new mongoose.Schema({
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now

    }
});

export const Comment = mongoose.model("Comment",commentSchema);