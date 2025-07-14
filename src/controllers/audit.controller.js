import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { AuditLog } from "../models/auditLog.model.js"
import mongoose from "mongoose"

export const getAuditTrail = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;



  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json(new ApiResponse(false, 400, "Invalid Task Id"))
  }

  const logs = await AuditLog.find({ task: taskId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  const totalCount = await AuditLog.countDocuments({ task: taskId });

  const totalPages = Math.ceil(totalCount / limitNumber);



  return res.status(200).json(new ApiResponse(
            true, 
            200, 
            "Audit Logs Fetched Successfully", 
            {
            logs,
            pagination: {
                totalCount,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber
            }
          }));
});