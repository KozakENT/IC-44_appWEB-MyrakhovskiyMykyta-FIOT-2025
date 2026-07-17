import { sql, poolPromise } from '../../config/db.js';
import { client } from '../../redis/connect.js';

export class ProductService {
    async getAllProducts() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM cProduct');
        return result.recordset;
    }

    async getProductById(id) {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('ProductId', sql.Int, id)
            .query('SELECT * FROM cProduct WHERE ProductId = @ProductId');

        return result.recordset[0]; // Вернет один продукт
    }

    async sortProducts(sortType) {
        const pool = await poolPromise;

        if (sortType === 'popular') {
            const ids = await this.popularSort();

            if (ids.length === 0) return [];

            const orderCase = ids
                .map((id, index) => `WHEN ProductId = ${id} THEN ${index}`)
                .join(' ');

            const result = await pool.request().query(`
                SELECT * FROM cProduct 
                WHERE ProductId IN (${ids.join(',')})
                ORDER BY CASE ${orderCase} END
            `);

            return result.recordset;
        }

        let orderBy = '';

        if (sortType === 'new') orderBy = 'ORDER BY DateChanges DESC';
        else if (sortType === 'priceASC') orderBy = 'ORDER BY ProductCost ASC' // ціна від низької до великої
        else if (sortType === 'priceDESC') orderBy = 'ORDER BY ProductCost DESC'; // ціна від великої до низької  
        else if (sortType === 'default') orderBy = 'ORDER BY ProductId ASC';

        const result = await pool.request().query(`SELECT * FROM cProduct ${orderBy}`);

        return result.recordset;
    }

    async createProduct(body) {
        const { name, price, description, category, photo } = body;
        const pool = await poolPromise;

        try {
            pool.request()
            .input ('name', sql.NVarChar(255), name)
            .input ('price', sql.Decimal(10,2), price)
            .input ('description', sql.NVarChar(255), description)
            .input ('category', sql.NVarChar(50), category)
            .input ('photo', sql.VarChar(255), photo)
            .query (`INSERT INTO cProduct 
                (ProductName, ProductCost, ProductDescription, ProductCategory, ProductPhoto) 
                VALUES (@name, @price, @description, @category, @photo)`)
            
            return { message: 'Product inserted!' };
        }
        catch (err) {
            console.error('Error inserting product: ', err);
            return { message: 'Product inserted!' };
        }
    }

    async updateProduct(id, field, value) {
        const pool = await poolPromise;
        if (field == 'ProductCost') {
            try {
                await pool.request()
                .input('id', sql.Int, id)
                .input('value', sql.Decimal(10,2), value)
                .query(`UPDATE cProduct SET ${field} = @value, DateChanges = GETDATE() WHERE ProductId = @id`);
            } catch (err) {
                console.error('Error updating product: ', err);
                throw err;
            }
        }
        else {
            try {
                await pool.request()
                .input('id', sql.Int, id)
                .input('value', sql.NVarChar(255), value)
                .query(`UPDATE cProduct SET ${field} = @value, DateChanges = GETDATE() WHERE ProductId = @id`);
            } catch (err) {
                console.error('Error updating product: ', err);
                throw err;
            }
        }
    }

    async deleteProduct(id) {
        const pool = await poolPromise;
        try {
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM cProduct WHERE ProductId = @id');

            return result.rowsAffected[0]; // вернёт количество удалённых строк
        } catch (err) {
            console.error('Error deleting product: ', err);
            throw err;
        }
    }

    async buttonBuyCounts(productId) {
        const pool = await poolPromise;

        // Використовується відсортований список в якому створюються унікальні значення в ключі products, які будуть інкрементуватися на 1
        const result = await client.zIncrBy('products', 1, productId)
        await client.expire('products', 86400)

        return true;
    }

    async popularSort() {
        // Вивід значень в списці products від 0 до 19го по індексу (Перші 20) 
        const topIds = await client.sendCommand(['ZREVRANGE', 'products', '0', '19']);
        return topIds;
    }

    async sortByWord(inputContent) {
        const pool = await poolPromise;
        try {
            const result = await pool.request()
                .input('pattern', sql.NVarChar, `%${inputContent}%`)
                .query(`SELECT * FROM cProduct
                        WHERE ProductName LIKE @pattern
                            OR ProductCategory LIKE @pattern
                            OR ProductDescription LIKE @pattern`);

            return result.recordset;
        } catch (err) {
            console.error('Error searching product: ', err);
            throw err;
        }
    }

    async sortByPrice(minvalue, maxvalue) {
        const pool = await poolPromise;
        try {
            const result = await pool.request()
            .input('minpara', sql.Decimal(10,2), minvalue)
            .input('maxpara', sql.Decimal(10,2), maxvalue)
            .query(`SELECT * FROM cProduct 
                    WHERE ProductCost >= @minpara AND ProductCost <= @maxpara`)

            return result.recordset;
        }
        catch (err) {
            console.error('Error confirming price-sort', err);
            throw err;
        }
    }

    async addToCart(userId, productId) {
        const result = await client.hIncrBy(`cart:${userId}`, productId, 1)
        await client.expire(`cart:${userId}`, 86400)

        return result;
    }

    async getCart(userId) {
        const result = await client.hGetAll(`cart:${userId}`)
        await client.expire(`cart:${userId}`, 86400)

        return result;
    }

    async delFromCart(userId, productId) {
        const result = await client.hDel(`cart:${userId}`, productId)

        return result;
    }

    async removeFromCart(userId, productId) {
        const result = await client.hIncrBy(`cart:${userId}`, productId, -1)
        if (result === 0) { await client.hDel (`cart:${userId}`, productId) }
        await client.expire(`cart:${userId}`, 86400)

        return result;
    }

    async saveDelivery(userId, deliveryPlace) {
        const result = await client.hSet(`user:${userId}`, {deliveryPlace})
        await client.expire(`user:${userId}`, 86400)

        return result;
    }

    async saveTypeOfPayment(userId, TypeOfPayment) {
        const result = await client.hSet(`user:${userId}`, {TypeOfPayment})
        await client.expire(`user:${userId}`, 86400)

        return result;
    }

    async calculateTotal(userId) {
        const cart = await this.getCart(userId); // { productId: quantity }
        const entries = Object.entries(cart);
        let total = 0;

        for (const [productId, quantity] of entries) {
            const product = await this.getProductById(productId); // уже есть у тебя
            let price = product.ProductCost;
            if (product.ProductDiscountPercent != null) {
                price = Math.round(product.ProductCost * (1 - product.ProductDiscountPercent / 100));
            }
            total += price * Number(quantity);
        }

        return total;
    }

    /* 
    Внутри checkoutRequest в сервисе уже сам достанешь из Redis доставку/оплату/корзину и сделаешь INSERT. 

    Сначала INSERT в cRequest — передаёшь userId, RequestStatus, RequestDate, RequestDeliveryPlace, RequestTypeOfPayment, 
    RequestFinalCost. Берёшь userId из order_id (ты же туда писал order_${userId}_${Date.now()}), доставку и оплату — 
    из Redis через hGetAll.

    Потом INSERT в cRequestRow — тянешь корзину из Redis через getCart(userId), проходишь по каждому товару циклом, 
    для каждого делаешь отдельный INSERT с RequestId (который получил после первого INSERT), ProductId, RequestQuantity, 
    RequestRowCost.

    Очистить Redis — корзину, доставку, оплату
    Вернуть LiqPay 200 OK — иначе он будет повторно слать колбэк
    */
    async checkoutRequest(userId, amount) {
        const userDraft = await client.hGetAll(`user:${userId}`);
        const delivery = userDraft.deliveryPlace;
        const payment = userDraft.TypeOfPayment;

        const finalCost = await this.calculateTotal(userId);

        const cart = await this.getCart(userId);
        const entries = Object.entries(cart)

        const pool = await poolPromise;
        try {
            const result = await pool.request()
            .input ('userId', sql.Int, userId)
            .input ('reqStatus', sql.NVarChar(255), "new")
            .input ('reqDate', sql.DateTime, new Date())
            .input ('reqDelivery', sql.NVarChar(255), delivery)
            .input ('reqPayment', sql.NVarChar(255), payment)
            .input ('reqFinalCost', sql.Decimal(10,2), finalCost)
            .query (`INSERT INTO cRequest 
                (UserId, RequestStatus, RequestDate, RequestDeliveryPlace, RequestTypeOfPayment, RequestFinalCost) 
                VALUES (@userId, @reqStatus, @reqDate, @reqDelivery, @reqPayment, @reqFinalCost);
                SELECT SCOPE_IDENTITY() AS RequestId`)
            
            const requestId = result.recordset[0].RequestId;

            for (const [productId, quantity] of entries) {
                const id = Number(productId);
                const qty = Number(quantity);

                const product = await this.getProductById(id);
                let price = product.ProductCost;
                if (product.ProductDiscountPercent != null) {
                    price = Math.round(product.ProductCost * (1 - product.ProductDiscountPercent / 100));
                };
                const rowCost = price * qty;

                await pool.request()
                .input ('reqId', sql.Int, requestId)
                .input ('productId', sql.Int, id)
                .input ('reqQnt', sql.Int, qty)
                .input ('reqRowCost', sql.Decimal(10,2), rowCost)
                .query (`INSERT INTO cRequestRow 
                    (RequestId, RequestQuantity, RequestRowCost, ProductId) 
                    VALUES (@reqId, @reqQnt, @reqRowCost, @productId)`)
            };

            return { message: 'Request Row inserted!' };
        }
        catch (err) {
            console.error('Error inserting request: ', err);
        }
    }
}

