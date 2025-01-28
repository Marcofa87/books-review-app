const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    // Login endpoint

    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const ISBN = req.params.isbn
    const review = req.body.review
    const username = req.session.username
    if (books[ISBN]) {

        books[ISBN].reviews[username] = review;
        return res.status(200).send("Review successfully posted");
    }
    else {
        return res.status(404).json({ message: `ISBN ${ISBN} not found` });
    }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.session.authorization.username;
    
    if (books[ISBN].reviews[username]){
        delete books[ISBN].reviews[username];
        res.send(`The review of the book with ISBN ${ISBN} from user ${username} has been deleted.`);
    } else {
        res.send(`No reviews with ISBN ${ISBN} from user ${username} were found in the database.`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;