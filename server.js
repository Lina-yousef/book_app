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
// const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL);


//Application Setup
const PORT = process.env.PORT || 3030;


server.use(cors());
server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

// server.use(errorHandler);

// Route definitions
server.get('/searches/new', handleSearch);
server.post('/searches', searchResult);

server.get('/', (req, res) => {
    res.render('pages/index');
})

// Show form function
function handleSearch(req, res) {
    res.render('pages/searches/new');
}

// searchResult function
function searchResult(req, res) {
    console.log(req.body);
    let search = req.body.search;

    let url = `https://www.googleapis.com/books/v1/volumes?q=${search}+intitle`;
    if (req.body.searchBy === 'author') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${search}+inauthor`;
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
}

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})