const express = require("express");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
let books = require("./booksdb.js");

const reg_users = express.Router();

let users = [];

// Add a book review
reg_users.put("/review/:isbn", (req, res) => {
    const review = req.body.review;
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    const reviewId = uuidv4();

    try {
        books[isbn].reviews[reviewId] = {
            username,
            text: review,
            createdAt: new Date(),
        };
        return res.status(200).json({ message: "Review has been added" });
    } catch (err) {
        return res.status(400).json({ message: "Invalid request" });
    }
});

// Delete a book review
reg_users.delete("/review/:isbn/:reviewId", (req, res) => {
    const username = req.user.username;
    const isbn = req.params.isbn;
    const reviewId = req.params.reviewId;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[reviewId]) {
        return res.status(404).json({ message: "Review not found" });
    }

    if (books[isbn].reviews[reviewId].username !== username) {
        return res
            .status(403)
            .json({ message: "Cannot delete another user's review" });
    }

    try {
        delete books[isbn].reviews[reviewId];
        return res.status(200).json({ message: "Review has been deleted" });
    } catch (err) {
        return res.status(400).json({ message: "Invalid request" });
    }
});

module.exports.authenticated = reg_users;
module.exports.users = users;
