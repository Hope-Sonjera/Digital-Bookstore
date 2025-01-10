import express from 'express';

import { Book } from '..models/bookModel.js';

const router = express.Router();

// Route to Save a New Book
router.post('/', async (req, res) => {
    const { title, author, publisherYear } = req.body;

    // Validate input
    if (!title || !author || !publisherYear) {
        return res.status(400).json({
            message: 'Please provide all required fields: title, author, publisherYear',
        });
    }

    try {
        // Create and save the book
        const book = new Book({ title, author, publisherYear });
        await book.save();
        res.status(201).json({
            message: 'Book created successfully',
            data: book,
        });
    } catch (error) {
        console.error('Error creating book:', error.message);
        res.status(500).json({ message: 'Server error. Could not create the book.' });
    }
});

// Route to Get All Books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json({
            count: books.length,
            data: books,
        });
    } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).json({ message: 'Server error. Could not fetch books.' });
    }
});

// Route to Get one Book by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find book by ID
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book:', error.message);
        res.status(500).json({ message: 'Server error. Could not fetch the book.' });
    }
});

// Route to Update a Book by ID
router.put('/:id', async (req, res) => {
    const { title, author, publisherYear } = req.body;

    // Validate input
    if (!title || !author || !publisherYear) {
        return res.status(400).json({
            message: 'Please provide all required fields: title, author, publisherYear',
        });
    }

    try {
        const { id } = req.params;

        // Update the book
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { title, author, publisherYear },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({
            message: 'Book updated successfully',
            data: updatedBook,
        });
    } catch (error) {
        console.error('Error updating book:', error.message);
        res.status(500).json({ message: 'Server error. Could not update the book.' });
    }
});

// Route to Delete a Book by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Attempt to delete the book
        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error.message);
        res.status(500).json({ message: 'Server error. Could not delete the book.' });
    }
});

export default router;