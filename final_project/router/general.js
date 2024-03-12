const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userWithSameName = users.filter((user) => {
    return user.username === username;
  });

  if (userWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({
        username,
        password,
      });
      return res.status(200).json({
        message: "User successfully registered.",
      });
    } else {
      res.status(404).json({
        message: "User already exists",
      });
    }
  }
  return res.status(404).json({
    message: "Unable to register user.",
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const getBookList = new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;

      if (success) {
        resolve(res.send(JSON.stringify(books, null, 4)));
      } else {
        reject(res.send("Failed to fetch book list"));
      }
    }, 5000);
  });

  // res.send(JSON.stringify(books, null, 4));

  // return res.status(200).json({
  //   message: "Success",
  //   books,
  // });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const getBookByIsbn = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isbn <= 10) {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error(`Book not found for ISBN: ${isbn}`));
        }
      } else {
        reject(new Error(`ISBN specified is out of range: ${isbn}`));
      }
    });
  }, 3000);

  getBookByIsbn
    .then(function (book) {
      res.send(book);
    })
    .catch(function (error) {
      console.log(error.message);
      res.send(error.message);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code
  const author = req.params.author;
  const getBookDetailsByAuthor = new Promise((resolve, reject) => {
    setTimeout(function () {
      let bookDetails = [];

      for (let key in books) {
        if (author === books[key].author) {
          bookDetails.push(books[key]);
        }
      }
      //array empty?
      if (bookDetails.length > 0) {
        resolve(bookDetails);
      } else {
        reject(new Error(`No book/s found by author: ${author}`));
      }
    }, 2000);
  });

  getBookDetailsByAuthor
    .then(function (bookDetails) {
      res.send(JSON.stringify(bookDetails));
    })
    .catch(function (error) {
      console.log(error.message);
      res.status(404).send(error.message);
    });

  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;

  const getBookByTitle = new Promise((resolve, reject) => {
    setTimeout(function () {
      let bookDetails = [];

      for (let key in books) {
        if (title === books[key].title) {
          bookDetails.push(books[key]);
        }
      }
      if (bookDetails.length > 0) {
        resolve(bookDetails);
      } else {
        reject(new Error(`No book found with the title: ${title}`));
      }
    }, 2000);
  });

  getBookByTitle
    .then(function (bookDetails) {
      res.send(JSON.stringify(bookDetails));
    })
    .catch(function (error) {
      console.log(error);
      res.status(404).send(error.message);
    });
  // return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const bookISBN = req.params.isbn;

  res.send(JSON.stringify(books[bookISBN].reviews));

  // return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
