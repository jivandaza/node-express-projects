import express from 'express';
import userController from './../controller/userController.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/auth', userController.authenticate);
router.get('/logout', userController.logout);

export default router;