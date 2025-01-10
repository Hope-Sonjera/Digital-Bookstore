import express from 'express';
import cors from 'cors';
import { PORT, MongoDBURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';

const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Basic route to check if the server is running
app.get('/', (request, response) => {
    console.log('Request received at root');
    return response.status(200).send('Welcome to MIE Library');
});

// Route to Save a new book
app.post('/books', async (request, response) => {
    try {
        // Destructure fields from the incoming request body
        const { title, author, publisherYear } = request.body;

        // Check if all required fields are provided
        if (!title || !author || !publisherYear) {
            return response.status(400).send({
                message: 'Please provide all required fields: title, author, publisherYear',
            });
        }

        // Create a new book document with the provided data
        const newBook = { title, author, publisherYear };

        // Save the new book to the database
        const book = await Book.create(newBook);

        // Return the newly created book as the response
        return response.status(201).send(book);

    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get all books from the database
app.get('/books', async (request, response) => {
    try {
        // Fetch all books from the database
        const books = await Book.find({});
        
        // Return the list of books
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get one book from the database by ID
app.get('/books/:id', async (request, response) => {
    try {
        const { id } = request.params;

        // Fetch the book with the specified ID
        const book = await Book.findById(id);

        // If book is not found, return a 404 error
        if (!book) {
            return response.status(404).send({ message: 'Book not found' });
        }

        // Return the book details
        return response.status(200).json(book);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Connect to MongoDB and start the server
mongoose
    .connect(MongoDBURL)
    .then(() => {
        console.log('App connected to database');
        // Start the server once the database connection is successful
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });
