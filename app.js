const express = require('express');
const connectDB = require('./config/db'); 
const cors = require('cors');

const authRoutes = require('./routes/api/auth');
const postRoutes = require('./routes/api/posts');

const app = express();
connectDB();

app.use(cors());

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello');
});


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;