import express from 'express';
import cors from 'cors';
import productRouter from '../src/admin.crud/product.routes.js';
import authRouter from '../src/auth/auth.router.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use ('/api/products', productRouter);
app.use ('/api/auth', authRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
