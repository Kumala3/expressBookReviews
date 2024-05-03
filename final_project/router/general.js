const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const doesExist = username => {
    let users_with_same_name = users.filter(user => {
        return user.username === username;
    });
    if (users_with_same_name.length > 0) {
        return true;
    } else {
        return false;
    }
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
        return res.status(400).json({ message: `User ${username} already exist` });
    }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        return res.status(200).json(book);
    }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author.toLowerCase();

    const book = Object.values(books).find(
        book => book.author.toLowerCase() === author
    );

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        return res.status(200).json(book);
    }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title.toLowerCase();

    const book = Object.values(books).find(
        book => book.title.toLowerCase() === title
    );

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    } else {
        return res.status(200).json(book);
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
