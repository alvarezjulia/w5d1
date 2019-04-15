const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index')
})

router.get('/books', (req, res) => {
    //get all the books
    //No query because we want to get all the books
    Book.find({})
        .then(books => {
            res.render('books', { books })
        })
        .catch(err => {
            console.error('Error while finding the books', err)
        })
})

router.get('/books/edit/:bookId', (req, res) => {
    const _id = req.params.bookId
    Book.findOne({ _id })
        .then(book => {
            res.render('book-edit', { book })
        })
        .catch(err => {
            console.error(err)
        })
})

router.post('/books/edit/:bookId', (req, res) => {
    const { title, author, description, rating } = req.body
    const _id = req.params.bookId
    Book.findOneAndUpdate({ _id }, { title, author, description, rating }, { new: true })
        .then(updatedData => {
            //{book: updatedData} para pasar info del libro updated, no del libro pasado
            //book: porque en book-detail.hbs lo hemos llamado book
            // res.render('book-detail', { book: updatedData })

            //This takes you to books/:bookId
            res.redirect(`/books/${updatedData._id}`)
            console.log('Book successfully updated')
        })
        .catch(err => {
            console.error('Error while updating the book in the database', err)
        })
})

router.get('/books/add', (req, res) => {
    res.render('book-add')
})

router.post('/books/add', (req, res) => {
    const { title, author, description, rating } = req.body
    Book.create({ title, author, description, rating })
        .then(() => {
            res.redirect('/books')
            console.log('Book successfully created')
        })
        .catch(err => {
            console.error('Error while creating book', err)
        })
})

router.get('/books/:bookId', (req, res) => {
    const _id = req.params.bookId
    //find one returns only one document
    Book.findOne({ _id })
        .populate('author')
        .then(book => {
            //You pass everything from the book
            res.render('book-detail', { book }).catch(err => {})
            console.error('Error while retrieving book with id' + _id, err)
        })
})

router.get('/authors/add', (req, res) => {
    res.render('author-add')
})

router.post('/authors/add', (req, res) => {
    const { firstName, lastName, nationality, birthday, pictureUrl } = req.body
    Author.create({ firstName, lastName, nationality, birthday, pictureUrl })
        .then(() => {
            res.redirect('/books')
        })
        .catch(err => {
            console.error('Error while adding author', err)
        })
})

module.exports = router
