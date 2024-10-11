import {server as app} from './server.js'
import connectDB from './config/connectDB.js';

const PORT = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>')
})