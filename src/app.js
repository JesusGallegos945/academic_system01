import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv/config';
import connectDB from './connection/db.js';
import authRoutes from './routes/auth.js';

connectDB(); 
const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api', authRoutes);


export default app;