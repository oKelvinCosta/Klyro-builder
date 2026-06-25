import cors from 'cors';
import dotenv from 'dotenv';

import express from 'express';
import './config/db.js';
import { connectDB } from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import exportRoutes from './routes/exportRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
dotenv.config();

const app = express();

app.use(cors({
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

connectDB();


app.get('/', (_req, res) => {
  res.json({ message: 'API funcionando' });
});

app.use('/pages', pageRoutes);
app.use('/projects', projectRoutes);
app.use('/groups', groupRoutes);
app.use('/users', userRoutes);
app.use('/export', exportRoutes);

app.use("/auth", authRoutes);

app.get('/health', (_req, _res) => {
  _res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log('server.js - Servidor rodando 🚀');
  console.log(`server.js - Local:   http://localhost:${PORT}/`);
});
