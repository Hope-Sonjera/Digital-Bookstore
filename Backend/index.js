import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, MongoDBURL } from './config.js';
import { Book } from './models/bookModel.js';
import booksRoute from './routes/booksRoute.js';

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Root Route
app.get('/', (req, res) => {
  console.log('Root endpoint accessed');
  res.status(200).send('Welcome to MIE Library');
});

app.use('/books'. booksRoute);


// Connect to MongoDB and Start the Server
mongoose
  .connect(MongoDBURL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
