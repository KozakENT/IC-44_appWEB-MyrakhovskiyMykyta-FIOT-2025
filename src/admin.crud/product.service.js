import { sql, poolPromise } from '../../config/db.js';

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
                .query(`UPDATE cProduct SET ${field} = @value WHERE ProductId = @id`);
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
                .query(`UPDATE cProduct SET ${field} = @value WHERE ProductId = @id`);
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
}