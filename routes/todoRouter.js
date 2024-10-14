import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    createTodo,
    getTodos,
    changeTodoStatus,
    deleteTodo
} from '../controllers/todoControllers.js';

const todoRouter = Router();

todoRouter.post('/todo/create', isAuthenticated, createTodo);
todoRouter.get('/todo/getTodos', isAuthenticated, getTodos);
todoRouter.patch('/todo/changeStatus/:_id', isAuthenticated, changeTodoStatus);
todoRouter.delete('/todo/delete/:_id', isAuthenticated, deleteTodo);

export default todoRouter;