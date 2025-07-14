import Joi from "joi"
import { ApiError } from "../utils/ApiError.js"
import mongoose from "mongoose";

// Custom validator for ObjectId
const isValidObjectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

const commentValidation = (input) => {
    const validationRule = Joi.object({
        commentText: Joi.string().required().messages({
            "any.required": "Title is required",
            "string.base": "Comment must be a string"
        }),
        taskId: Joi.string().custom(isValidObjectId, "ObjectId Validation").required()
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
}

export {commentValidation}