import mongoose from "mongoose";
import { User } from "./user.model.js";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description:{
            type:String
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        members:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }]
    },
    {
        timestamps: true
    }
);

export const Project = mongoose.model("Project",projectSchema)