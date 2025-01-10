import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, MongoDBURL } from './config.js';
import { Book } from './models/bookModel.js';

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Root Route
app.get('/', (req, res) => {
  console.log('Root endpoint accessed');
  res.status(200).send('Welcome to MIE Library');
});

// Route to Save a New Book
app.post('/books', async (req, res) => {
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
app.get('/books', async (req, res) => {
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

// Route to Get a Book by ID
app.get('/books/:id', async (req, res) => {
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
app.put('/books/:id', async (req, res) => {
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

// Connect to MongoDB and Start the Server
mongoose
  .connect(MongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
