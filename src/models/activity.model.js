import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: [true, "Task  Id is required"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"],
        },
        message: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        actions: {
            type: String,
            enum: ['created', 'updated', 'status-changed', 'commented', 'assigned', 'unassigned'],
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Activity = mongoose.model("Activity",activitySchema);