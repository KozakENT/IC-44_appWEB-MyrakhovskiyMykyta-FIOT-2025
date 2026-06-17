import { Router } from 'express';
import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct, sortProducts, buttonBuyClick, sortByWord, sortByPriceSlider,
    addToCart, getCart, removeFromCart
 } from './product.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';

const router = Router();

router.get('/sort/:sortType', sortProducts);
router.get('/search/:inputContent', sortByWord);
router.get('/price/:minvalue-:maxvalue', sortByPriceSlider);
router.post('/buy/:id', buttonBuyClick);
router.post('/cart/:productId', authMiddleware, addToCart);
router.get('/cart', authMiddleware, getCart);
router.delete('/cart/:productId', authMiddleware, removeFromCart);

// загальні — в кінці
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;