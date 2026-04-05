import { Router } from 'express';
import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct, sortProducts, buttonBuyClick } from './product.controller.js';

const router = Router();

router.get('/', getAllProducts)

router.get('/:id', getProductById);

router.post('/', createProduct)

router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);

router.get('/sort/:sortType', sortProducts);

router.post('/buy/:id', buttonBuyClick);

export default router;