import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from './models/db.js';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import MongoStore from 'connect-mongo';
import path from "path";
import {fileURLToPath} from 'url';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import pagesRouter from './routes/pages.js';

const app = express();
const hostname = 'localhost';
const port = 3000;
const __dirname = fileURLToPath(new URL(".", import.meta.url));

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser('devjs2024'));
// Configuración de express-session y connect-mongo para almacenar sesiones en MongoDB
app.use(
    session({
        secret: 'devjs2024',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/movies',
            collection: 'sessions',
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Configurar la vida útil de la cookie de sesión (en este caso, 1 día)
    })
);

// Middleware de connect-flash
app.use(flash());

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/pages', pagesRouter);

app.listen(port, () => {
    console.log(`\n\tLa aplicación se inicio en http://${hostname}:${port}/\n`);
});

// Manejar cierre del servidor
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Conexión a la base de datos cerrada');
        process.exit(0);
    });
});