'use strict';

// Application Dependencies
const express = require('express');
const server = express();
//CORS = Cross Origin Resource Sharing
const cors = require('cors');
//DOTENV (read our enviroment variable)
require('dotenv').config();
// Superagent
const superagent = require('superagent');

// postgresql
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);


//Application Setup
const PORT = process.env.PORT || 3030;


server.use(cors());
server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

// server.use(errorHandler);

// Route definitions
server.get('/', getBooks);
server.get('/searches/new', handleSearch);
server.post('/searches', searchResult);
server.get('/books/:bookID',getOneBook);
server.post('/books',addBook);

// get all books data from table
// function getBooks(req,res){
//     let SQL =`SELECT * FROM books;`

//     client.query(SQL)
//     .then (result =>{
//         console.log(result.rows);
//         res.render('pages/index',{booksList:result.rows});
//     });
// }
// get ALL books
function getBooks(req, res) {
    let SQL = `SELECT * FROM books;`;
    client.query(SQL)
        .then(allBooks => {
            res.render('pages/index', { booksList: allBooks.rows });
        });
}

// get one book
function getOneBook(req,res){

 let SQL = `SELECT * from books WHERE id=$1;`;
 let value = [req.params.bookID];

 client.query(SQL,value)
 .then(result=>{
   // console.log(result.rows);
   res.render('pages/books/show',{book:result.rows[0]});
 })
}

function addBook(req,res){
 let SQL = `INSERT INTO books (title, author, description, img, isbn, shelf)
           VALUES($1,$2,$3,$4,$5,$6) RETURNING id;`;
    let values = [req.body.title, req.body.author, req.body.description, req.body.img, req.body.isbn, req.body.shelf];
    client.query(SQL, values)
        .then(result => {
            res.redirect(`/books/${result.rows[0].id}`);
        })
}

// Show form function
function handleSearch(req, res) {
    res.render('pages/searches/new');
}

// searchResult function
function searchResult(req, res) {
    console.log(req.body);
    let search = req.body.search;

    let url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${search}`;
    if (req.body.searchBy === 'author') {
        url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${search}`;
    }
    superagent.get(url)
        .then(bookData => {
            let bookArr = bookData.body.items.map(value => new Book(value));
            // res.send(bookArr);
            res.render('pages/searches/show', { books: bookArr });
        })
    // .catch(()=>{ 

    // })
}

// function errorHandler(error, req, res){
//     res.status(500).send( error);
// }

// Book constructor
function Book(data) {
    this.title = (data.volumeInfo.title) ? data.volumeInfo.title : `Title unavilable`;
    this.authors = (Array.isArray(data.volumeInfo.authors)) ? data.volumeInfo.authors.join(', ') : `Author unavilable`;
    this.description = (data.volumeInfo.description) ? data.volumeInfo.description : `description unavilable`;
    this.img = (data.volumeInfo.imageLinks) ? data.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
    this.isbn = (data.volumeInfo.industryIdentifiers) ? data.volumeInfo.industryIdentifiers[0].identifier : `Unknown ISBN`;
    this.shelf = (data.volumeInfo.categories) ? data.volumeInfo.categories : `The book is not in a shelf`;
}

client.connect()
.then(()=>{
    server.listen(PORT, () =>
    console.log(`listening on ${PORT}`)
    );
})