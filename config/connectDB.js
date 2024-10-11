import mongoose from "mongoose";
import {server as app} from '../server.js';

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    })
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
