import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql, poolPromise } from '../../config/db.js';

export class AuthService {

    async findUserByUsername(username) {

        const pool = await poolPromise;
        const result = await pool.request()
            .input("username", sql.NVarChar, username)
            .query(`
                SELECT UserId, Username, PasswordHash
                FROM cUser
                WHERE LTRIM(RTRIM(Username)) = LTRIM(RTRIM(@username))
            `);

        return result.recordset[0];
    }

    async getUserRole(userId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query(`
                SELECT r.RoleName
                FROM cUserRole ur
                JOIN cRole r ON r.RoleId = ur.RoleId
                WHERE ur.UserId = @userId
            `);

        return result.recordset[0]; // { RoleName: 'Admin' }
    }

    async verifyPassword(inputPassword, storedHash) {
        return bcrypt.compare(inputPassword, storedHash);
    }

    async generateToken(userId, role) {
        return jwt.sign(
            { id: userId, role: role },
            "SECRET_KEY",
            { expiresIn: "2h" }
        );
    }
}

export class UserService {
    async addNewAccount(body) {
        const pool = await poolPromise;

        const passwordHash = await bcrypt.hash(body.password, 12);

        try {
            await pool.request()
                .input('username', sql.NVarChar, body.username)
                .input('phoneNumber', sql.NVarChar, body.phoneNumber)
                .input('email', sql.NVarChar, body.email)
                .input('RequestId', sql.Int, null) 
                .input('passwordHash', sql.NVarChar, passwordHash)
                .query(`
                    INSERT INTO cUser
                    (Username, PhoneNumber, Email, RequestId, PasswordHash)
                    VALUES (@username, @phoneNumber, @email, @RequestId, @passwordHash)
                    INSERT INTO cUserRole
                    (UserId, RoleId) VALUES (SCOPE_IDENTITY(), 2)
                `);

            return { message: 'Account created!' };
        } catch (err) {
            console.error('Error creating account:', err);
            return { message: 'Account creation failed!' };
        }
    }
}

