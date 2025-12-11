import express from 'express';
import cors from 'cors';
import productRouter from '../src/admin.crud/product.routes.js';
import authRouter from '../src/auth/auth.router.js';

const app = express();

app.use(cors());
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
