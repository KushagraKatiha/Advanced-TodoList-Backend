import user from "../models/userModel.js";
import JWT from 'jsonwebtoken';
import ApiError from "../utils/ApiError.js";
// constructor(
//     statusCode,
//     message = 'Internal server error',
//     errors = [],
//     stack = ""
// )

import ApiResponse from '../utils/ApiResponse.js';  
// constructor(
//     stautsCode,
//     data,
//     message = 'Success'
// )

export const signup = async (req, res, next) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return next(new ApiError(400, 'All fields are required'))
    }

    const userExists = await user.findOne({email});
    if(userExists){
        return next(new ApiError(400, 'User already exists'))
    }

    const newUser = new user({
        name,
        email,
        password
    })

    await newUser.save();

    const response = new ApiResponse(201, newUser, 'User created successfully');
    res.status(response.statusCode).json(response);
};

export const signin = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ApiError(400, 'All fields are required'))
    }

    const existingUser = await user.findOne({email});

    if(!existingUser){
        return next(new ApiError(400, 'User does not exist'))
    }

    const isMatch = await existingUser.matchPassword(password);

    if(!isMatch){
        return next(new ApiError(400, 'Invalid credentials'))
    }

    // Generate JWT token punch them in the cookie and send it to the client

    const token = JWT.sign({id: existingUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true
    })

    const response = new ApiResponse(200, existingUser, 'User signed in successfully');

    res.status(response.statusCode).json(response);
};

export const signout = async (req, res, next) => {
    if(!req.cookies.token){
        return next(new ApiError(400, 'User not signed in'))
    }

    if(req.cookies.token){
        res.clearCookie('token');
    }

    const response = new ApiResponse(200, {}, 'User signed out successfully');

    res.status(response.statusCode).json(response);
};

export const isUserSignedIn = async (req, res, next) => {
    if(!req.cookies.token){
        return next(new ApiError(400, 'User not signed in'))
    }

    const token = req.cookies.token;

    const decodedId = JWT.verify(token, process.env.JWT_SECRET);

    const existingUser = await user.findById(decodedId.id);

    if(!existingUser){
        return next(new ApiError(400, 'User not found'))
    }

    const response = new ApiResponse(200, existingUser, 'User signed in');
    res.status(response.statusCode).json(response);
};

export const changePassword = async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;

    if(!oldPassword || !newPassword){
        return next(new ApiError(400, 'All fields are required'))
    }

    const existingUser = await user.findById(req.user._id).select('+password');

    const isMatch = await existingUser.matchPassword(oldPassword);

    if(!isMatch){
        return next(new ApiError(400, 'Invalid credentials'))
    }

    existingUser.password = newPassword;

    await existingUser.save();

    const response = new ApiResponse(200, {}, 'Password changed successfully');

    res.status(response.statusCode).json(response);
};

// export const forgotPassword = async (req, res) => {};

export const updateProfile = async (req, res, next) => {
    const {name, email} = req.body;

    if(!name || !email){
        return next(new ApiError(400, 'At least one field is required'))
    }

    if(name) req.user.name = name;
    if(email) req.user.email = email;

    await req.user.save();

    const response = new ApiResponse(200, req.user, 'Profile updated successfully');

    res.status(response.statusCode).json(response);
};

export const updateProfilePicture = async (req, res) => {};

