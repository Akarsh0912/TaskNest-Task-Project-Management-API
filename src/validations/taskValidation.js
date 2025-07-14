import Joi from "joi";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

// Custom validator for ObjectId
const isValidObjectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

const taskValidation = (input) => {
    const validationRule = Joi.object({
        title: Joi.string().required().messages({
            "any.required": "Title is required",
            "string.base": "Title must be a string"
        }),
        description: Joi.string().required().messages({
            "any.required": "Description is required",
            "string.base": "Description must be a string"
        }),
        status: Joi.string()
            .valid("todo", "in-progress", "done")
            .default("todo"),
        dueDate: Joi.date().optional(),
        assignedTo: Joi.string().custom(isValidObjectId, "ObjectId Validation").required()
            .messages({
                "any.required": "assignedTo is required",
                "any.invalid": "assignedTo must be a valid ObjectId"
            }),
        projectId: Joi.string().custom(isValidObjectId, "ObjectId Validation").required()
            .messages({
                "any.required": "projectId is required",
                "any.invalid": "projectId must be a valid ObjectId"
            }),
    });

    const { error } = validationRule.validate(input);

    if (error) {
        throw new ApiError(422, error.details[0].message);
    }
    return true;
};

export { taskValidation };
