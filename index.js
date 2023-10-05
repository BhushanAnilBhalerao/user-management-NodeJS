const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

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
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

// 2. Register user API
app.post('/create-user', (req, res) => {
    const { name, username, password } = req.body;
    //Check if username is ''
    if (username === "") {
        res.json({ success: false, message: 'Username Cannot be Empty' });

    }
    // Check if username is already taken
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        res.json({ success: false, message: 'Username already exists' });
        return;
    }

    const newUser = { id: users.length + 1, name, username, password };
    users.push(newUser);

    req.session.user = newUser;
    res.json({ success: true, message: 'User created successfully' });
});

// 3. Get all user details API
app.get('/get-details', (req, res) => {
    if (req.session.user) {
        // Send the list of users
        res.json(users);
    } else {
        res.json({ success: false, message: 'Users not found' });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
