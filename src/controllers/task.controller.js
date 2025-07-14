import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Task } from "../models/task.model.js"
import { Project } from "../models/project.model.js"
import { taskValidation } from "../validations/taskValidation.js"
import mongoose from "mongoose"
import { Activity } from "../models/activity.model.js"


//create taks
export const createTask = asyncHandler(async (req, res) => {
    const { title, description, dueDate, assignedTo, projectId, tags } = req.body;

    taskValidation({ title, description, dueDate, assignedTo, projectId });

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(400).json(new ApiResponse(false, 400, "Project Not Found"))
    }

    //check if current user is part of the project or not
    if (!project.members.includes(req?.user?.id)) {
        return res.status(403).json(new ApiResponse(false, 403, "Current User is Not a Member of the Project"))
    }

    // Check if assignedTo is a member
    if (!project.members.includes(assignedTo)) {
        return res.status(400).json(new ApiResponse(false, 400, "Assigned user is not in a project"));
    }

    //create task
    const task = await Task.create({
        title: title,
        description: description,
        dueDate: dueDate,
        assignedTo: assignedTo,
        project: projectId,
        tags: tags
    });

    if (!task) {
        throw new ApiError(500, "Task creation failed!!!");
    }

    //log task activity
    await Activity.create({
        task: task._id,
        user: req.user.id,
        action: 'created',
        message: `Task "${title}" was created`
    })


    return res.status(201).json(new ApiResponse(true, 201, "Task Created Successfully!!", task));
});

//get task by project id
export const getTaskByProjectId = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;

    //find project
    const task = await Task.find(
        {
            project: projectId
        }
    )
        .populate('assignedTo', 'name');

    if (!task) {
        return res.status(400).json(new ApiResponse(false, 400, "Task not found"));
    }
    return res.status(200).json(new ApiResponse(true, 200, "Task Fetched Successfully!!", task))
});

//update task status
export const updateTaskStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { taskStatus } = req.body;

    //find task
    const task = await Task.findById(taskId);

    if (!task) {
        return res.status(400).json(new ApiResponse(false, 400, "Task Not Found"));
    }

    task.status = taskStatus;
    task._updatedBy = req.user.id; // for auditing
    await task.save()

    //log task Update activity
    await Activity.create({
        task: task._id,
        user: req.user.id,
        action: 'status-changed',
        message: `Status changed to "${taskStatus}"`
    });

    return res.status(200).json(new ApiResponse(true, 200, "Task status updated successfully!", task))

});

export const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    //find task and delete
    const task = await Task.findByIdAndDelete(taskId);

    return res.status(200).json(new ApiResponse(true, 200, "Task Deleted Successfully", task));
});

//ADD FOLLOWER
export const addFollower = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json(new ApiResponse(false, 400, "Task Id is Invalid"));
    }

    const task = await Task.findOne(taskId);

    if (!task) {
        return res.status(400).json(new ApiResponse(false, 400, "Task not found"));
    }

    if (!task.followers.includes(req.user.id)) {
        task.followers.push(req.user.id);
        await task.save();
    }

    return res.status(200).json(new ApiResponse(true, 200, "You are now following this task"));

});

//REMOVE FOLLOWERS
export const removeFollower = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json(new ApiResponse(false, 400, "Invalid Task ID"));
    }

    const task = await Task.findOne(taskId);

    if (!task) {
        return res.status(400).json({
            success: false,
            statusCode: 404,
            message: "Task Not Found"
        });
    }

    task.followers = task.followers.filter((id => id.toString() !== req.user.id));
    await task.save();

    return res.status(200).json(new ApiResponse(true, 200, "Unfollowed task"));
});

// GET TASK BY TAG
export const getTaskByTag = asyncHandler(async (req, res) => {
    const { tags } = req.query;

    const tagList = tags.split(",");

    const task = await Task.find({ tags: { $in: tagList } }).populate("assignedTo", "name");

    return res.status(200).json(new ApiResponse(true, 200, "Task fetched successsfully", task));
});



//GET FILTERED TASK
export const getFilteredTasks = asyncHandler(async (req, res) => {
    const {
        status, priority, tags, search, dueAfter, dueBefore, project, assignedTo
    } = req.query;

    // create filter object
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;
    if (assignedTo) filter.assignedTo = assignedTo;

    if (tags) {
        const tagList = tags.split(',');
        filter.tags = { $in: tagList };
    }

    if (dueAfter || dueBefore) {
        filter.dueDate = {};
        if (dueAfter) filter.dueDate.$gte = new Date(dueAfter);
        if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
    }

    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;


    const tasks = await Task.find(filter)
        .populate('assignedTo', 'name')
        .populate('project', 'name')
        .sort({ [sortField]: sortOrder });

    if (!tasks) {
        return res.status(400).json(new ApiResponse(false, 400, "Tasks not found"))
    }

    return res.status(200).json(new ApiResponse(true, 200, "Task fetched successfully", tasks))




});