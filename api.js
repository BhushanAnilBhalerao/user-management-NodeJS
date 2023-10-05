const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { generateId } = require('./service');
const UserDTO = require('./userDTO');

const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Data structure to store user details in session
const users = [];

// 1. Login user API
app.post('/auth', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ success: false, message: 'Username and password are required' });
            return;
        }

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            req.session.user = user;
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'An unexpected error occurred' });
    }
});


// 2. Register user API
app.post('/create-user', (req, res) => {
    try {
        const { name, username, password } = req.body;

        const id = generateId();
        const newUser = new UserDTO(id, name, username, password);

        const existingUser = users.find(user => user.username === newUser.username);
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Username already exists' });
            return;
        }

        users.push(newUser);

        req.session.user = newUser;
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: 'Unexpected error occurred' });
        }
    }
});

// 3. Get all user details API
app.get('/get-details', (req, res) => {
    try {
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unexpected error occurred' });
    }
});

module.exports = app;
