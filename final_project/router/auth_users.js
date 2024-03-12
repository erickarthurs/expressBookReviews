const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check if the username is valid
  let existingUsername = users.filter((user) => {
    return user.username === username;
  });

  if (existingUsername.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Error logging in",
    });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid login. Check username and password" });
  }
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn;
  let bookReview = req.query.review;
  const username =
    req.session.authorization && req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = bookReview;
    res.status(200).send("Review updated successfully");
  } else {
    books[isbn].reviews[username] = bookReview;
    res
      .status(201)
      .send(
        `Review for the book ISBN ${isbn} has been added/updated successfully`
      );
  }

  // return res.status(300).json({ message: "Yet to be implemented" });
});

//delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  const username =
    req.session.authorization && req.session.authorization.username;

  console.log("isbn: " + isbn);
  console.log("username: " + username);
  console.log("book: ", book);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  if (book.reviews && book.reviews[username]) {
    delete book.reviews[username];

    return res
      .status(200)
      .send(
        `The book ISBN ${isbn} has been successfully deleted from  the database`
      );
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
