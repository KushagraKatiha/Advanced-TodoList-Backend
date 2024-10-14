import user from "../models/userModel.js";
import JWT from 'jsonwebtoken';
import ApiError from "../utils/ApiError.js";
import upload from "../middlewares/multer.js";
import {uploadImage, deleteImage} from "../middlewares/cloudinary.js";
import fs from 'fs';
import ApiResponse from '../utils/ApiResponse.js';  

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

    const response = new ApiResponse(201, 'User created successfully');
    res.status(response.statusCode).json(response);
};

export const signin = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ApiError(400, 'All fields are required'))
    }

    const existingUser = await user.findOne({email}).select('+password');
    
    if(!existingUser){
        return next(new ApiError(400, 'User does not exist'))
    }

    const isMatch = await existingUser.matchPassword(password, existingUser.password);

    if(!isMatch){
        return next(new ApiError(400, 'Invalid credentials'))
    }

    // Generate JWT token punch them in the cookie and send it to the client

    const token = JWT.sign({id: existingUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });    

    res.cookie('token', token, {
        httpOnly: true,
        // secure: true
    })

    existingUser.password = undefined;
    console.log(token);
    
    
    
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

export const getUser = async (req, res, next) => {
    const response = new ApiResponse(200, req.user, 'User fetched successfully');

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

export const updateProfilePicture = async (req, res, next) => {
    
    upload.single('profileImage')(req, res, async (err) => {
        if(err){
            return next(new ApiError(400, 'Image upload failed'))
        }

        console.log('req.user=>', req.user);
        

        if(req.user.profileImg.publicId){
            await deleteImage(req.user.profileImg.publicId);
        }

        const imagePath = req.file.path;
        
        const cloudinaryResponse = await uploadImage(imagePath);
        if(!cloudinaryResponse){
            return next(new ApiError(400, 'Image upload failed'))
        }

        // Delete the image from the server
        fs.unlinkSync(imagePath);        

        req.user.profileImg.url = cloudinaryResponse.url;
        req.user.profileImg.publicId = cloudinaryResponse.public_id;
        await req.user.save();

        const response = new ApiResponse(200, req.user, 'Profile picture updated successfully');

        res.status(response.statusCode).json(response);
    })
};


