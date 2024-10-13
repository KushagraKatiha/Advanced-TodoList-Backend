import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiError from "./utils/ApiError.js";
import userRouter from "./routes/userRoutes.js";

const server = express();

server.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

server.use(
  express.json({
    limit: "16kb",
  })
);

server.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

server.use(express.static("public"));



server.use("/", userRouter);
server.use(cookieParser());

server.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    console.log('error found !!');
    
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      success: false,
    });
  }

  // Handle generic errors
  return res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    success: false,
  });
});

export { server };
