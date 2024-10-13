import { Router } from "express";
import {signup, signin, signout, changePassword, updateProfile, updateProfilePicture, } from '../controllers/userControllers.js'
import isAuthenticated from "../middlewares/isAuthenticated.js";

const userRouter = Router()

userRouter.post('/user/signup', signup)
userRouter.post('/user/signin', signin)
userRouter.post('/user/signout', signout)
userRouter.post('/user/changePassword', changePassword)
userRouter.post('/user/updateProfile', updateProfile)
userRouter.post('/user/updateProfilePicture',isAuthenticated, updateProfilePicture)
userRouter.get('/', (req, res)=>{
    res.send('<h1 style="background-color:#000000; color:#ffffff; text-align:center">Welcome to user routes</h1>')
})

export default userRouter