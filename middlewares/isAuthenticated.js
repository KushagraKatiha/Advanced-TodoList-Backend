import JWT from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import user from '../models/userModel.js';

const isAuthenticated = async (req, _, next) => {

    console.log('req.cookies=>', req.cookies);
    
   
        // Correct cookie access
        const token = req.cookies?.token; 

        console.log('token from auth => ', token);

        // Check if the token exists
        if (!token) {
            return next(new ApiError(401, 'Unauthorized'));
        }

        // Verify the token
        const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
        console.log('decodedToken=>', decodedToken);

        if (!decodedToken) {
            return next(new ApiError(401, 'Unauthorized'));
        }

        // Find the user by ID
        const existingUser = await user.findById(decodedToken.id);
        console.log('existingUser=>', existingUser);

        if (!existingUser) {
            return next(new ApiError(401, 'Unauthorized'));
        }

        // Attach user to the request object
        req.user = existingUser;
        next();
    
};

export default isAuthenticated;
