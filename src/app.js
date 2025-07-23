import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv/config';
import connectDB from './connection/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import careersRoutes from './routes/careers.routes.js';
import teachersRoutes from './routes/teachers.routes.js';
import studentsRoutes from './routes/students.routes.js';
import groupsRoutes from './routes/groups.routes.js';
import subjectsRoutes from './routes/subjects.routes.js';

connectDB(); 
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use('/api/auth', authRoutes);
app.use('/api', careersRoutes);
app.use('/api', teachersRoutes);
app.use('/api', studentsRoutes);
app.use('/api', groupsRoutes);
app.use('/api', subjectsRoutes);

export default app;