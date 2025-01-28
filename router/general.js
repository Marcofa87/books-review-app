const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const handlePromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 6000);
    });
};

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
/* public_users.get('/', async function (req, res) {
    //Write your code here
    let bookList = await handlePromise(books)
    res.send(JSON.stringify(bookList, null, 4))

}); */

public_users.get('/', async function (req, res) {
    try {
        const bookList = await handlePromise();
        // Send the response with proper formatting
        res.json(bookList);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve books', details: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    try {
        const ISBN = req.params.isbn
        const bookList = books[ISBN]
        res.send(bookList)
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve books', details: error.message });
    }

});

/* public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const ISBN = req.params.isbn
    res.send(books[ISBN])
}); */

// Get book details based on author
/* public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    bookKeys.forEach(key => {
        const book = books[key];
        if (book.author === author) {
            matchingBooks.push(book);
        }
    });

    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).send('No books found for the given author.');
    }
}); */
public_users.get('/author/:author', async function (req, res) {
    try {
        const bookList = await handlePromise(books)
        const author = req.params.author;
        const bookKeys = Object.keys(bookList);
        const matchingBooks = [];

        bookKeys.forEach(key => {
            const book = books[key];
            if (book.author === author) {
                matchingBooks.push(book);
            }
        });

        if (matchingBooks.length > 0) {
            res.json(matchingBooks);
        } else {
            res.status(404).send('No books found for the given author.');
        }
    }
    catch (error) {
        {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Failed to retrieve books', details: error.message });
        }
    }
});

// Get all books based on title
/* public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    bookKeys.forEach(key => {
        const book = books[key];
        if (book.title === title) {
            matchingBooks.push(book);
        }
    });

    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).send('No books found for the given title.');
    }
}); */

public_users.get('/title/:title', async function (req, res) {
    try {
        const bookList = await handlePromise(books)
        const title = req.params.title;
        const bookKeys = Object.keys(bookList);
        const matchingBooks = [];

        bookKeys.forEach(key => {
            const book = books[key];
            if (book.title === title) {
                matchingBooks.push(book);
            }
        });

        if (matchingBooks.length > 0) {
            res.json(matchingBooks);
        } else {
            res.status(404).send('No books found for the given title.');
        }
    }
    catch {}
    
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let ISBN = req.params.isbn
    let reviews = req.params.reviews
    res.send(books[ISBN].reviews)
});


// Check if a user with the given username already exists
const doesExist = (username) => {
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



module.exports.general = public_users;
