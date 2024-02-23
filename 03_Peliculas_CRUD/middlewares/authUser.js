const authenticateUser = (req, res) => {

    const { user } = req.session;

    console.log(req.session);

    if ( !user ) {
        return res.redirect('/');
    }

    // Verificar el rol del usuario
    if (user.role === 'admin') {
        // Si es un administrador, redirigir a la página de administrador
        return res.redirect('pages/user/user.html');
    } else if (user.role === 'user') {
        console.log('es role user')
        return res.redirect('pages/user/user.html');
    } else {
        // Manejar otros roles según sea necesario
        //return res.redirect('/user.html');
    }

};

export default authenticateUser;