const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter( (user) => {
    return  user.username === username;
  });
  if (userswithsamename.length > 0 ){
    return false;
  }else return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let userswithsamenameandpassword = users.filter( (user) => {
    return user.username === username && user.password === password;
  });
  if (userswithsamenameandpassword.length > 0) return true;
  else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password){
    return res.status(404).json({message: "Error logging in!"});
  }

  if (authenticatedUser(username,password)){
    let accessToken = jwt.sign({data:password}, 'access', {expiresIn : 60*60});
    req.session.authorization = {
      accessToken,username
    };
    return res.status(200).send("User successfully logged in!");
  }else{
    return res.status(208).json({message: "Invalid login,enter username or password again!"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  if (isbn){
    let book= books[isbn];
    let book_reviews = book['reviews'];
    let username = req.session.authorization['username'];
    let review_text = req.body.review_text;
    if (review_text)  {
      if (book_reviews[username]){
        book_reviews[username] = review_text; 
        return res.status(200).json({message:"Review modified successfully",book_reviews});
      }
      book_reviews[username] = review_text; 
      return res.status(200).json({message:"Added review successfully",book_reviews});

    }
    return res.status(404).json({message:"Error! Can not add review"});
  }else{
    res.send("Book not found!");
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  if (isbn){
    let book= books[isbn];
    let book_reviews = book['reviews'];
    let username = req.session.authorization['username'];
    delete book_reviews[username];
    res.status(200).json({message:"Review deleted",book_reviews});
  }else{
    res.send("Book not found!");
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
