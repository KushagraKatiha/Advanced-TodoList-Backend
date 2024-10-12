import { Router } from "express";
import {signup, signin, signout, changePassword, isUserSignedIn, updateProfile, updateProfilePicture, } from '../controllers/userControllers.js'

const userRouter = Router()

userRouter.post('/user/signup', signup)
userRouter.post('/user/signin', signin)
userRouter.post('/user/signout', signout)
userRouter.post('/user/changePassword', changePassword)
userRouter.post('/user/isUserSignedIn', isUserSignedIn)
userRouter.post('/user/updateProfile', updateProfile)
userRouter.post('/user/updateProfilePicture', updateProfilePicture)
userRouter.get('/', (req, res)=>{
    res.send('<h1 style="background-color:#000000; color:#ffffff; text-align:center">Welcome to user routes</h1>')
})

export default userRouter