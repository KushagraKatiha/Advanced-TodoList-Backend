import {server as app} from './server.js'
import connectDB from './config/connectDB.js';

const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    })
})
.catch((err) =>{
    console.log(`MongoDB connection failed: ${err}`);
})
