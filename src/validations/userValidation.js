import  Joi  from "joi"
import { ApiError } from "../utils/ApiError.js"

const userValidation = (input) => {
    const validationRule = Joi.object({
        name: Joi.string(),
        email: Joi.string().email({ tlds: { allow: true } }),
        password: Joi.string()
            .pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
            .message({
                'string.pattern.base':
                'Password must be at least 8 characters, include one uppercase letter and one numeric digit',
            }),
        role:Joi.string()
             .valid("admin","team_member")
             .default("team_member")
    });

    const {error} = validationRule.validate(input);

    if(error){
        throw new ApiError(422,error.details[0].message);
    }
    return true
}


export  {
    userValidation
}