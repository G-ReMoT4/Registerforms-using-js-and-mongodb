const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();

// Middleware to parse form data
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/dbname', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log('MongoDB connection successful');
});

// Define user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const Users = mongoose.model('User', userSchema);

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form POST request
app.post('/post', async (req, res) => {
    const { username, email, password } = req.body;  // Extract data from form submission
    const user = new Users({
        username,
        email,
        password,
    });

    try {
        await user.save();  // Save the user to MongoDB
        console.log(user);   // Optional: log the saved user
        res.send("Form Submission Successful");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving user");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
