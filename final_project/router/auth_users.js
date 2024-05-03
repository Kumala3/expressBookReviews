const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let books = require("./booksdb.js");

const reg_users = express.Router();

let users = [];

const isValid = username => {
    // Returns boolean
    // Write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
    const user = users.find(
        user => user.username === username && user.password === password
    );
    return user != null;
};

// Only registered users can login
reg_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username or password is incorrect" });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign(
            { data: password },
            process.env.SECRET_JW_TOKEN,
            {
                expiresIn: "24h",
            }
        );

        req.session.authorization = { accessToken: accessToken };

        return res
            .status(200)
            .json({ message: "User successfully logged in!" });
    } else {
        return res.status(403).json({ message: "User not authenticated" });
    }
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.session.authorization
        ? req.session.authorization["accessToken"]
        : null;

    if (!token) {
        return res.status(403).json({ message: "User not logged in" });
    }

    jwt.verify(token, process.env.SECRET_JW_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated" });
        }
        req.user = decoded; // Attach user to request object
        next(); // Pass control to the next handler
    });
}

// Add a book review
reg_users.put("/review/:isbn", verifyToken, (req, res) => {
    const review = req.query.review;
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    try {
        books[isbn].review = review;
        return res.status(200).json({ message: "Review added" });
    } catch (err) {
        return res.status(400).json({ message: "Invalid request" });
    }
});

module.exports.authenticated = reg_users;
module.exports.isValid = isValid;
module.exports.users = users;
