import { Router } from "express";
import {
  signup,
  signin,
  signout,
  changePassword,
  updateProfile,
  updateProfilePicture,
  getUser,
} from "../controllers/userControllers.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const userRouter = Router();

userRouter.get("/user/getUser", isAuthenticated, getUser);
userRouter.post("/user/signup", signup);
userRouter.post("/user/signin", signin);
userRouter.post("/user/signout", isAuthenticated, signout);
userRouter.post("/user/changePassword", isAuthenticated, changePassword);
userRouter.post("/user/updateProfile", isAuthenticated, updateProfile);
userRouter.post(
  "/user/updateProfilePicture",
  isAuthenticated,
  updateProfilePicture
);

export default userRouter;
