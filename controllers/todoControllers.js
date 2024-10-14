import todo from '../models/todoModel.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const createTodo = async (req, res, next) => {
    const {title} = req.body;

    if(!title){
        return next(new ApiError(400, 'Title is required'))
    }

    const newTodo = new todo({
        title,
        user: req.user._id
    });

    await newTodo.save();

    const response = new ApiResponse(201, newTodo, 'Todo created successfully');
    res.status(response.statusCode).json(response);
}

export const getTodos = async (req, res, next) => {
    const todos = await todo.find({user: req.user._id});

    if(!todos){
        return next(new ApiError(404, 'No todos found'));
    }

    const response = new ApiResponse(200, todos, 'Todos fetched successfully');
    res.status(response.statusCode).json(response);
}

export const changeTodoStatus = async (req, res, next) => {
    const {_id} = req.params;

    const existingTodo = await todo.findById(_id);

    if(!existingTodo){
        return next(new ApiError(404, 'Todo not found'));
    }

    existingTodo.status = existingTodo.status === 'completed' ? 'pending' : 'completed';

    await existingTodo.save();

    const response = new ApiResponse(200, existingTodo, 'Todo status changed successfully');

    res.status(response.statusCode).json(response);
}

export const deleteTodo = async (req, res, next) => {
    const {_id} = req.params;

    const existingTodo = await todo.findById(_id);

    if(!existingTodo){
        return next(new ApiError(404, 'Todo not found'));
    }

    await existingTodo.remove();

    const response = new ApiResponse(200, {}, 'Todo deleted successfully');
    res.status(response.statusCode).json(response);
}
