import cors from 'cors';
import dotenv from 'dotenv';

import express from 'express';
import './config/db.ts';
import { connectDB } from './config/db.ts';
import authRoutes from "./routes/authRoutes.ts";
import exportRoutes from './routes/exportRoutes.ts';
import groupRoutes from './routes/groupRoutes.ts';
import pageRoutes from './routes/pageRoutes.ts';
import projectRoutes from './routes/projectRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
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
  console.log('server.ts - Servidor rodando 🚀');
  console.log(`server.ts - Local:   http://localhost:${PORT}/`);
});
