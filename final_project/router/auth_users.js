const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const reg_users = express.Router();

let users = [];

const isValid = username => {
    // Returns boolean
    // Write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
    const user = users.find(user => {
        user.username === username && user.password === password;
    });
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
        const accessToken = jwt.sign({ data: password }, "access", {
            expiresIn: "24h",
        });

        req.session.authorization = { accessToken };

        return res
            .status(200)
            .json({ message: "User successfully logged in!" });
    } else {
        return res.status(403).json({ message: "User not authenticated" });
    }
});

// Add a book review
reg_users.put("/auth/review/:isbn", (req, res) => {
    // Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = reg_users;
module.exports.isValid = isValid;
module.exports.users = users;
