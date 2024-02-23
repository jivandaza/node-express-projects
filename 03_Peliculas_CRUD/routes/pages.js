import express from 'express';
import path from 'path';
import {fileURLToPath} from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const router = express.Router();

// Ruta de inicio
router.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, './../public/pages/user/user.html'));
});

// Ruta de inicio
router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, './../public/pages/admin/admin.html'));
});

export default router;