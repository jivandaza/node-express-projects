import auth from './auth.js';

const $frmLoginMessage = document.getElementById('frmLoginMessage');
const $btnLogin = document.getElementById('btnLogin');

function login() {
    $btnLogin.addEventListener('click', async (e) => {
        e.preventDefault();

        // Validar campos
        const userInput = document.getElementById('user').value.trim();
        const password = document.getElementById('password').value.trim();

        if ( validateFormLogin(userInput, password) ) {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userInput, password }),
            });

            const { message } = await response.json();

            showUserHelp(null, true);
            showPasswordHelp(null, true);

            // Manejar la respuesta del servidor
            if (response.ok) {
                setTimeout(() => {
                    showMessageForm(message, 'success');
                    setTimeout(() => {
                        location.href = '/user/auth';
                    }, 2000);
                }, 2000);
            } else if ( response.status === 400 ) {
                showUserHelp(message, false);
            } else if ( response.status === 500 ) {
                showMessageForm(message, 'danger');
            }
        }
    });
}

function validateFormLogin(user, password) {
    if (!user) {
        showUserHelp('This user is required.', false);
        return false;
    } else {
        showUserHelp(null, true);
    }

    if (!password) {
        showPasswordHelp('This password is required.', false);
        return false;
    } else {
        showPasswordHelp(null, true);
    }

    return true;
}

function showMessageForm (message, type) {
    // Mostrar el contenido del contenedor de mensaje de formulario.
    $frmLoginMessage.style.display = 'block';
    $frmLoginMessage.innerHTML = `
        <div class="center-element">
            <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    // Ocultar el contenido del contenedor de mensaje de formulario después de un breve tiempo.
    setTimeout(() => {
        $frmLoginMessage.innerHTML = `
            <div class="alert alert-${type} text-center" role="alert">
                ${message}
            </div>
        `;
        // Ocultar el contenido del contenedor de mensaje de formulario después de un breve tiempo.
        setTimeout(() => {
            $frmLoginMessage.style.display = 'none';
        }, 2000 );
    }, 2000 );
}

function showUserHelp(message, valid) {
    const $user = document.getElementById('userHelp');

    if ( valid ) {
        $user.textContent = 'The user is your email or username.';
        $user.className = 'form-text';
    } else {
        $user.textContent = message;
        $user.className = 'form-text text-danger';
    }
}

function showPasswordHelp(message, valid) {
    const $pass = document.getElementById('passwordHelp');

    if ( valid ) {
        $pass.textContent = 'Is required.';
        $pass.className = 'form-text';
    } else {
        $pass.textContent = message;
        $pass.className = 'form-text text-danger';
    }
}

export default login;