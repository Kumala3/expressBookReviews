const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const doesExist = username => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    const user = users.find(
        user => user.username === username && user.password === password
    );
    return user != null;
};

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }

    if (!doesExist(username)) {
        users.push({ username: username, password: password });
        return res.status(201).json({ message: `User ${username} created` });
    } else {
        return res
            .status(400)
            .json({ message: `User ${username} already exist` });
    }
});

public_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username or password is incorrect" });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign(
            { username: username },
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

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    try {
        const response = await axios.get("");
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`/${isbn}`);
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch book" });
    }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    const author = req.params.author.toLowerCase();

    try {
        const response = await axios.get(`/${author}`);
        return res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch book" });
    }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title.toLowerCase();

    try {
        const response = await axios.get(`/${title}`);
        return res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch book" });
    }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        return res.status(200).json(book.reviews);
    }
});

module.exports.general = public_users;
