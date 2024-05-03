const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = username => {
    // Returns boolean
    // Write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
    // Returns boolean
    // Write code to check if username and password match the one we have in records.
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    // Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
