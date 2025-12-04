const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator.js');
const Book = require('../models/Book');

// GET /api/books - get all books
router.get('/', (req, res) => {
    Book.find().sort({ createdAt: -1 })
    .then((books) => {
        return res.status(200).json({
            books: books,
        })
    })
    .catch((err) => {
        res.status(500).json({ message: 'Error fetching books', error: err });
    });
});

router.get('/:id', (req, res) => {
    Book.findById(req.params.id)
    .then((book) => {
      if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
    })
    .catch((err) => {
    res.status(500).json({ message: 'Error fetching book', error: err });
  });
});

// POST /api/books - create new book
router.post('/', (req, res) => {
    const maxBookId = sequenceGenerator.nextId("books");

    const newBook = new Book({
        ...req.body,
        id: maxBookId,
    });

    newBook.save()
    .then(createdBook => {
      res.status(201).json({
        message: 'Book added successfully',
        book: createdBook
      });
    })
    .catch(error => {
       res.status(500).json({
          message: 'An error occurred',
          error: error
        });
    });
});

// PUT /api/books/:id - update book
router.put('/:id', (req, res) => {
  
    Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    .then((updatedBook) => {
        if (!updatedBook) {
            return res.status(404).json({
                message: 'Book not found',
            });
        }

        res.status(204).json({
            message: 'Book updated successfully'
        }) 
    })
    .catch((err) => {
    res.status(500).json({ message: 'Error updating book', error: err });
  })
});

// DELETE /api/books/:id - delete book
router.delete('/:id', (req, res) => {
  Book.findByIdAndDelete(req.params.id)
  .then((deleted) => {
    if (!deleted) {
        return res.status(404).json({
            message: 'Book not found',
        });
    }

     res.status(204).json({
            message: "Book deleted successfully"
          });
  })
  .catch((err) => {
    res.status(500).json({ message: 'Error deleting book', error: err });
  })
});

module.exports = router;
