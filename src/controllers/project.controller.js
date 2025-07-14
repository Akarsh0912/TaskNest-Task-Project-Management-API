import { User } from "../models/user.model.js"
import { Project } from "../models/project.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { binarySearchObjectId } from "../helper/binarySecrch.js"
import mongoose from "mongoose"

//controller to create project(admin only)
export const createProject = asyncHandler(async (req, res) => {
    //check current user is admin or not
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            statusCode: 403,
            message: "Only admin can create Projects"
        })
    }

    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "All Fields are required"
        })
    }

    const existedProject = await Project.findOne({ name });
    if (existedProject) {
        return res.status(409).json({
            success: false,
            statusCode: 409,
            message: `Project already exist with ${name} name`
        })
        // throw new ApiError(409,`Project already exist with ${name} this name`)
    }

    //create project
    const project = await Project.create({
        name: name,
        description: description,
        createdBy: req?.user?.id,
        members: [req?.user?.id]  // Add creator as a member by default
    });

    if (!project) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Project Creation Failed"
        })
    }

    return res.status(201).json(new ApiResponse(201, "Project created successfully", project))
});

//add member to project controller
export const addMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Project ID or User ID is not valid"
        });
    }


    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Project not found"
        })
    }

    //check user is already in the project or not
    const member = project.members.includes(userId);
    if (!member) {
        project.members.push(userId)
        await project.save()
    }

    return res.status(201).json(new ApiResponse(201, "Member added successfully", project))

});

//remove member from project controller
export const removeMember = asyncHandler(async (req, res) => {
    //only admin can remove member
    if(req.user.role !== 'admin'){
        return res.status(400).json({
            success:false,
            statusCode:400,
            message:"Only Admin can remove Member"
        })
    }

    const { projectId, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Project ID or User ID is not valid"
        });
    }


    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Project Not Found"
        })
    }

    const projectMemberArray = project.members;
    console.log("member array",projectMemberArray)

    //check user exist or not
    const memberIndex = binarySearchObjectId(projectMemberArray, userId);
    if (memberIndex !== -1) {
        project.members.splice(memberIndex, 1);
        project.save();
    }
    else {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Member Not Found in the Project"
        })
    }

    //return final response
    return res.status(200).json(new ApiResponse(200, "Member Removed Successfully!!!"));


});

// Get all projects of the current user
export const getMyProject = asyncHandler(async (req, res) => {
    const currentUser = req?.user?.id;

    const projects = await Project.find({ members: currentUser })
                                  .populate("createdBy", "name email")
                                  .populate("members", "name email");

    if (!projects || projects.length === 0) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Project Not Found"
        })
    }

    return res.status(200).json(new ApiResponse(200, "Projects Found Successfully!!!!", projects));

})