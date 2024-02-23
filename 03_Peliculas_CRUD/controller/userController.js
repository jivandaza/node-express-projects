import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './../models/user.js';
import Connect from './../models/db.js';

const register = async (req, res) => {
    try {
        // Llamar al método connect para establecer la conexión a la base de datos
        Connect.connect();

        const { username, email, password } = req.body;
        const role = 'user';

        // Validar primero el nombre de usuario
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            // Llamar al método disconnected para manejar la desconexión después de la respuesta
            Connect.disconnected();
            return res.status(400).json({ message: 'This username is already registered.', existUser: true });
        }

        // Si el nombre de usuario no existe, validar la dirección de correo electrónico
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            // Llamar al método disconnected para manejar la desconexión después de la respuesta
            Connect.disconnected();
            return res.status(400).json({ message: 'This email is already registered.', existEmail: true });
        }

        // Crear un nuevo usuario
        const newUser = new User({ role, username, email, password });
        await newUser.save();

        // Llamar al método disconnected para manejar la desconexión después de la respuesta
        Connect.disconnected();

        res.json({ message: 'Successfully registered' });
    } catch (error) {
        console.error('Failed to register a user: ', error);
        // Llamar al método disconnected para manejar la desconexión después de la respuesta
        Connect.disconnected();
        res.status(500).json({ message: 'Failed to register a user' });
    }
}

const login = async (req, res) => {
    try {
        // Llamar al método connect para establecer la conexión a la base de datos
        Connect.connect();

        const { userInput, password } = req.body;

        const user = await User.findOne({ $or: [{ username: userInput }, { email: userInput }] }).exec();

        // Llamar al método disconnected para manejar la desconexión después de la respuesta
        Connect.disconnected();

        if (!user) {
            return res.status(400).json({ message: 'This user does not exist.' });
        }

        const isPasswordCorrect = await user.isCorrectPassword(password);

        if (isPasswordCorrect) {
            // Configuración de LocalStrategy (debería hacerse solo una vez)
            passport.use(new LocalStrategy(async (username, password, done) => {
                if (username === user.username && password === user.password) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }));

            // Crear sesión y almacenar información del usuario en ella
            const { username, email, role } = user;
            req.session.user = {
                _id: user._id,
                username,
                email,
                role
            };

            res.status(200).json({ message: 'Successful login' });
        } else {
            return res.status(500).json({ message: 'Incorrect username or password' });
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        // Llamar al método disconnected para manejar la desconexión después de la respuesta
        Connect.disconnected();
        return res.status(500).json({ message: 'Failed to login' });
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/pages/logout.html');
    });
}

const authenticate = (req, res, next) => {

    const { role } = req.session.user;

    console.log(role)
    let redirect = '';

    // Redirecciona según el rol del usuario
    if (role === 'admin') {
        redirect = '/pages/admin';
    } else if (role === 'user') {
        redirect = '/pages/user';
    } else {
        // Puedes manejar otros roles según sea necesario
        //res.redirect('/login');
    }

    // Ejecuta el middleware de autenticación
    passport.authenticate('local', {
        successRedirect: redirect,
        failureRedirect: '/',
        failureFlash: true,
    })(req, res, next);
};

export default {
    register,
    login,
    logout,
    authenticate
}