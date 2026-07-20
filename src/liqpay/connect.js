import { ProductService } from '../admin.crud/product.service.js';
import crypto from 'crypto';

const productService = new ProductService();
var BASE_URL = 'https://premortuary-garnett-nonevolving.ngrok-free.dev';

export const getLiqpayForm = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = `order_${userId}_${Date.now()}`;
        const finalPrice = await productService.calculateTotal(userId);

        const params = {
            'action'      : 'pay',
            'amount'      : finalPrice,
            'public_key'  : process.env.LIQPAY_PUBLIC_KEY,
            'currency'    : 'UAH',
            'description' : 'Оплата товарів інтернет-магазину OnlyFresh',
            'order_id'    : orderId,
            'version'     : '3',
            'result_url'  : `${BASE_URL}/api/products/checkout/success`,
            'server_url'  : `${BASE_URL}/api/products/checkout/callback`
        };

        const data = Buffer.from(JSON.stringify(params)).toString('base64');
        const signature = crypto
            .createHash('sha1')
            .update(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY)
            .digest('base64');

        res.json({ data, signature });
    }
    catch(err) {
        console.error('getLiqpayForm error:', err);
        res.status(500).json({ message: err.message });
    }
};