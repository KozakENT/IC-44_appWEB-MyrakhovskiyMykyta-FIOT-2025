import { Router } from 'express';
import { login, me, addNewAccount } from './auth.controller.js';
import { authMiddleware, roleMiddleware } from './auth.middleware.js';


const router = Router();

router.post('/login', login);

router.get('/me', authMiddleware, me);

router.get('/admin/panel',
    authMiddleware,
    roleMiddleware(['Admin']),
    (req, res) => res.json({ message: "Welcome to admin panel" })
);

router.post('/registrate', addNewAccount)

export default router;