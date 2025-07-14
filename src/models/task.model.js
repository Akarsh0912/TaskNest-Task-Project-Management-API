import mongoose from "mongoose";
import { Activity } from "./activity.model.js"


const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"]
        },
        description: {
            type: String,
            required: [true, "Description is required"]
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo"
        },
        dueDate: {
            type: Date
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"]
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, "Project id is required"],
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        tags: {
            type: [String],
            enum: ['bug', 'feature', 'enhancement', 'low-priority', 'research'],
            default: []
        }
    },
    {
        timestamps: true
    }
);

taskSchema.pre("save", async function (next) {
    //this will check if task is creating then skip for that.
    if (this.isNew) {
        return next();
    }

    const task = this;

    const original = await task.constructor.arguments.findById(task?._id).lean();

    if (!original) {
        return next();
    }

    const changedFields = ['status', 'priority', 'assignedTo', 'dueDate'];
    const changes = [];

    changedFields.forEach(field => {
        const oldVal = original[field]?.toString();
        const newVal = task[field]?.toString();
        if (oldVal !== newVal) {
            changes.push({
                field,
                oldValue: original[field],
                newValue: task[field]
            });
        }
    });

    // Only log if changes exist
    if (changes.length > 0 && task._updatedBy) {
        await AuditLog.create({
            task: task._id,
            user: task._updatedBy,
            changes
        });
    }

    next();



})





export const Task = mongoose.model("Task", taskSchema)