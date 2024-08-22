const express = require('express');
const fs = require('fs').promises;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (username && password){
    if (isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered! You can login now"});
    }else return res.status(404).json({message: "User already exists!"});
  }
    return res.status(404).json({message: "User can not be registered!"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try{
      const data = await fs.readFile('./booksdb','utf-8');
      const booklist = JSON.parse(data);
      return res.status(200).json({message:"Booklist available",booklist});
    }catch(error){
      return res.status(404).json({message:"Error",error:error.message});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try{
    let isbn = req.params.isbn;
    const data = await fs.readFile('./booksdb.js','utf-8');
    const booklist = JSON.parse(data);
    for (let index in booklist){
      if (index == isbn){
        res.send(JSON.stringify(booklist[index]));
        return res.status(200).json({message: "OK"});
      }
    }
  }catch(error){
    return res.status(404).json({message:"Error occurred",error:error.message});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try{
    let author = req.params.author;
    let filtered_books = [];
    const data = await fs.readFile('./booksdb.js','utf-8');
    const booklist = JSON.parse(data);
    for (let index in booklist){
      if (booklist[index].author === author){
        filtered_books.push(booklist[index]);
      }
    }
    if (filtered_books.length > 0){
      res.send(JSON.stringify(filtered_books,null,4));
      return res.status(200).json({message:"OK"});
    }
  }catch(error){
    return res.status(404).json({message:"Book not found!",error:error.message});
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  try{
    let title = req.params.title;
    let filtered_books = [];
    const data = await fs.readFile('./booksdb.js','utf-8');
    const booklist = JSON.parse(data);
    for (let index in booklist){
      if (booklist[index].title === title){
        filtered_books.push(booklist[index]);
      }
    }
    if (filtered_books.length > 0){
      res.send(JSON.stringify(filtered_books,null,4));
      return res.status(200).json({message:"OK"});
    }
  }catch(error){
    res.status(404).json({message:"Error",error:error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  for (let index in books){
    if (index == isbn){
      res.send(JSON.stringify(books[index].reviews));
      return res.status(200).json({message: "OK"});
    }
  }
  return res.status(404).json({message: "Not found!"});
});

module.exports.general = public_users;
