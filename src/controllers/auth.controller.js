import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { userValidation } from "../validations/userValidation.js"

//generate access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and resfresh token")
    }
}


//register controller
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    userValidation({ name, email, password, role });

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(400, "User already exists with this email");
    }

    //register user
    const user = await User.create({
        name: name,
        email: email,
        password: password,
        role: role
    });

    const createdUser = await User.findById(user?._id).select(
        '-password -refreshToken'
    )

    if (!createdUser) {
        throw new ApiError(500, "Error occured while registering user")
    }

    return res.status(201).json(new ApiResponse(201, "User Registered Successfully", createdUser));

});

//login controller
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and Password both are required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    //generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);

    const loggedInUser = await User.findById(user?._id).select(" -password -refreshToken");

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(new ApiResponse(200, "User logged in Successfully", {
            user: loggedInUser, accessToken, refreshToken
        },))



});

//logout controller
export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
});

// SEND OTP FOR RESET 
export const sendOtpForReset = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is Required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json(new ApiResponse(false, 400, "User Not Found"))
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.expireAt = new Date(Date.now() + 15 * 60 * 1000) // valid for 15 mins
    await user.save();

    // You can later integrate SMS/Email here
    return res.status(200).json(new ApiResponse(true,200,"OTP Generated",otp));

});

//RESET PASSWORD WITH OTP
export const resetPasswordWithOtp = asyncHandler(async(req,res)=>{
    const { email, otp, newPassword } = req.body;

    if(!email || !otp || !newPassword ){
        return res.status(400).json(new ApiResponse(false,400,"All fields are required"));
    }

    const user = await User.findOne({email,otp});

    if(!user || user.expireAt<Date.now()){
        return res.status(400).json(new ApiResponse(false,400,"OTP Expired or Invalid"));
    }

    user.password = newPassword;
    user.otp = null;
    user.expireAt = null;
    await user.save();

    return res.status(200).json(new ApiResponse(true,200,"Password Reset Successfully"));

})
