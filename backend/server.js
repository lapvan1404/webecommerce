import cors from 'cors';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie + CORS
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://webecommerce-phi.vercel.app'
    ],
    credentials: true,
  })
);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Paypal
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Static uploads
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);