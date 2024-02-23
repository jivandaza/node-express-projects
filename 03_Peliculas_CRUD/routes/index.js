import express from 'express';
import path from 'path';
import {fileURLToPath} from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const router = express.Router();

// Ruta de inicio
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './../public/index.html'));
});

export default router;