import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Activity } from "../models/activity.model.js"
import mongoose from "mongoose"

// Get Activity For Task
export const getActivityForTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json(new ApiResponse(false, 400, "Invalid Task Id"));
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const [logs, totalCount] = await Promise.all([
        Activity.find({ task: taskId })
            .populate('user', 'name')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limitNumber),
        Activity.countDocuments({ task: taskId })
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    return res.status(200).json(
        new ApiResponse(true, 200, "Logs fetched successfully", {
            logs,
            pagination: {
                totalCount,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber
            }
        })
    );
});

//get all task for admin
export const getAllProjectsActivity = asyncHandler(async(req,res)=>{
    if(req.user.role !== "admin"){
        return res.stauts(400).json(new ApiResponse(false,400,"Only Admin can see all projects activity"));
    }

    const allProjectsActivity = await Activity.find();

    if(!allProjectsActivity){
        return res.status(400).json(new ApiResponse(false,400,"Projects Activity not Found"));
    }

    return res.status(200).json(new ApiResponse(true,200,"All Projects Activity Found",allProjectsActivity))
})
