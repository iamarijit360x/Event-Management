import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connection from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connection();

// Use cors middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/auth',authRoutes);
app.use('/api/admin',adminRoutes);



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
