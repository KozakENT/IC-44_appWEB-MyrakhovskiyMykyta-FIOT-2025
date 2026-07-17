import { ProductService } from './product.service.js';
import { client } from '../../redis/connect.js';
import crypto from 'crypto';

const productService = new ProductService();

export const getAllProducts = async (req, res) => {
    try { 
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching products' });
    }
}

export const getProductById = async (req, res) => {
  const id = Number(req.params.id); // превращаем строку в число
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product by id' });
  }
};  

export const sortProducts = async (req, res) => {
    try {
        const sortType = req.params.sortType;
        const products = await productService.sortProducts(sortType);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sort error' });
    }
}

export const createProduct = async (req, res) => {
    try {
        const result = await productService.createProduct(req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Insert error" });
    }
}

export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { field, value } = req.body;
    try {
        await productService.updateProduct(id, field, value);
        res.json({ message: 'Product updated!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update error" });
    }
}

export const deleteProduct = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'Некоректний id продукту' });
    }

    try {
        const rowsAffected = await productService.deleteProduct(id); // вызываем сервис

        if (rowsAffected === 0) {
            return res.status(404).json({ message: 'Продукт не знайдено!' });
        }

        res.json({ message: 'Продукт видалено!' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: "Delete error", error: err.message });
    }
};

export const buttonBuyClick = async (req, res) => {
    const productId = req.params.id;
    try {
        await productService.buttonBuyCounts(productId);
        res.json({ message: 'Counted click on product!'});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Count error"})
    }
}

export const sortByWord = async (req, res) => {
    const inputContent = req.params.inputContent;
    try {
        const products = await productService.sortByWord(inputContent);
        res.json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Search input content error" })
    }
}

export const sortByPriceSlider = async (req, res) => {
    const minvalue = Number(req.params.minvalue);
    const maxvalue = Number(req.params.maxvalue);
    try {
        const products = await productService.sortByPrice(minvalue, maxvalue);
        res.json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Search input content error" })
    }
}

export const addToCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;
    try {
        const cart = await productService.addToCart(userId, productId);
        res.json(cart);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Create cart error" })
    }
}

export const getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await productService.getCart(userId);
        res.json(cart);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Open cart error" })
    }
}

export const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;
    try {
        const cart = await productService.removeFromCart(userId, productId);
        res.json(cart);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Create cart error" })
    }
}

export const saveDeliveryPlace = async (req, res) => {
    const userId = req.user.id;
    const deliveryPlace = req.body.deliveryPlace;
    try {
        const delivery = await productService.saveDelivery(userId, deliveryPlace);
        res.json(delivery);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Delivery save error" })
    }
}

export const savePaymentType = async (req, res) => {
    const userId = req.user.id;
    const TypeOfPayment = req.body.TypeOfPayment;
    try {
        const payment = await productService.saveTypeOfPayment(userId, TypeOfPayment);
        res.json(payment);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Payment save error" })
    }
}

export const checkoutSuccess = async (req, res) => { 

}

export const checkoutCallback = async (req, res) => {
    const data = req.body.data;
    const signature = req.body.signature;

    try {
        const sign = crypto
            .createHash('sha1')
            .update(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY)
            .digest('base64');
        if (sign !== signature) return res.status(400).json({ message: 'Invalid signature' });

        const decoded = Buffer.from(data, 'base64').toString('utf-8');
        const parsedData = JSON.parse(decoded);

        const orderId = parsedData.order_id;
        const userId = orderId.split('_')[1];

        if (parsedData.status !== 'success') return res.status(200).send('ok');
        else {
            await productService.checkoutRequest(userId, parsedData.amount);
            await client.del(`cart:${userId}`);
            await client.del(`user:${userId}`)
            res.status(200).send('ok');
        } 
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Checkout success error" })
    }
}
