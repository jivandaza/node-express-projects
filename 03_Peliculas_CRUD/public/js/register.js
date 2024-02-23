import main from './main.js';

// Referencia al contenedor de mensaje de formulario.
const $frmMessage = document.getElementById('frmMessage');
const $frmRegister = document.getElementById("frmUserRegister");
const $btnRegister = document.getElementById("btnUserRegister");

main.auth();
main.login();

$btnRegister.addEventListener("click", async (e) => {
    e.preventDefault();

    // Validar campos
    const username = document.getElementById('userNameReg').value.trim();
    const email = document.getElementById('emailReg').value.trim();
    const password = document.getElementById('passwordReg').value.trim();
    const passwordConfirm = document.getElementById('passwordConfirm').value.trim();

    const user = {
        username,
        email,
        password,
        passwordConfirm
    }

    if (validateFormRegister(user)) {
        // Realizar la solicitud al servidor
        const response = await fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const { existUser, existEmail, message } = await response.json();

        showUsernameHelp(null, true);
        showEmailHelp(null, true);

        // Manejar la respuesta del servidor
        if (response.ok) {
            showMessageForm(message, 'success');
            $frmRegister.reset();
        } else if ( response.status === 400 ) {

            if ( existUser ) {
                showUsernameHelp(message, false);
            }

            if ( existEmail ) {
                showEmailHelp(message, false);
            }

        } else if ( response.status === 500 ) {
            console.log(response.status, message);
            showMessageForm(message, 'danger');
        }
    }
});

function validateFormRegister(user) {
    const { username, email, password, passwordConfirm } = user;

    let message = '';

    if ( !username ) {
        message = 'The username is required.';
    } else if ( !containsWhitespace(username) ) {
        message = 'The username must not have blank spaces.';
    } else if (username.length < 5) {
        message = 'The username must contain 5 or more characters.';
    }

    if ( !message ) {
        showUsernameHelp(null, true);
    } else {
        showUsernameHelp(message, false);
        return false;
    }

    message = '';

    if ( !email ) {
        message = 'The email is required.';
    } else if (!isEmailAddress(email)) {
        message = 'The email is invalid.';
    }



    if ( !message ) {
        showEmailHelp(null, true);
    } else {
        showEmailHelp(null, false);
        return false;
    }

    const $password = document.getElementById('passwordRegHelp');

    if ( password ) {

        const $requirements = $password.querySelectorAll('li');

        message = '';


        if ( !isFirstCapitalLetter(password) ) {
            $requirements[0].className = 'text-danger';
            message = 'err';
        } else {
            $requirements[0].className = 'text-secondary';
        }

        if ( !hasLowercaseLetter(password) ) {
            $requirements[1].className = 'text-danger';
            message = 'err';
        } else {
            $requirements[1].className = 'text-secondary';
        }

        if ( !hasNumbers(password) ) {
            $requirements[2].className = 'text-danger';
            message = 'err';
        } else {
            $requirements[2].className = 'text-secondary';
        }

        if ( password.length < 8 ) {
            $requirements[3].className = 'text-danger';
            message = 'err';
        } else {
            $requirements[3].className = 'text-secondary';
        }

        if ( message ) {
            return false;
        }
    } else {
        $password.querySelectorAll('li')[0].className = 'text-danger';
        return false;
    }

    message = '';

    if (password !== passwordConfirm) {
        message = 'The passwords is different.';
    }

    const $passwordConf = document.getElementById('passwordConfirmHelp');

    if (!message) {
        $passwordConf.textContent = 'Is required.';
        $passwordConf.className = 'form-text';
    } else {
        $passwordConf.textContent = message;
        $passwordConf.className = 'form-text text-danger';
        return false;
    }

    return true;
}

// Definición de la función (messageInForm).
function showMessageForm (message, type) {
    // Mostrar el contenido del contenedor de mensaje de formulario.
    $frmMessage.style.display = 'block';
    $frmMessage.innerHTML = `
        <div class="center-element">
            <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    // Ocultar el contenido del contenedor de mensaje de formulario después de un breve tiempo.
    setTimeout(() => {
        $frmMessage.innerHTML = `
            <div class="alert alert-${type} text-center" role="alert">
                ${message}
            </div>
        `;
        // Ocultar el contenido del contenedor de mensaje de formulario después de un breve tiempo.
        setTimeout(() => {
            $frmMessage.style.display = 'none';
        }, 2000 );
    }, 2000 );
}

function showUsernameHelp(message, valid) {
    const $username = document.getElementById('usernameRegHelp');

    if ( valid ) {
        $username.textContent = 'Is required.';
        $username.className = 'form-text';
    } else {
        $username.textContent = message;
        $username.className = 'form-text text-danger';
    }
}

function showEmailHelp(message, valid) {
    const $email = document.getElementById('emailRegHelp');

    if ( valid ) {
        $email.textContent = 'Is required.';
        $email.className = 'form-text';
    } else {
        $email.textContent = message;
        $email.className = 'form-text text-danger';
    }
}

const containsWhitespace = (username) => {
    // Verificar si el username contiene espacios en blanco
    return !/\s/.test(username);
}

const isEmailAddress = (email) => {
    // Expresión regular para validar un formato de correo electrónico básico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar si el correo cumple con el formato
    return regex.test(email);
}

const isFirstCapitalLetter = (pass) => {
    // Verificar si la primera letra de la contraseña es mayúscula
    return pass[0] === pass[0].toUpperCase();
}

const hasLowercaseLetter = (pass) => {
    // Expresión regular para validar que haya al menos una letra minúscula
    const regex = /[a-z]/;

    // Verificar si la contraseña cumple con la expresión regular
    return regex.test(pass);
}

const hasNumbers = (pass) => {
    // Expresión regular para validar que haya al menos un número
    const regexNumero = /\d/;

    // Verificar si la contraseña cumple con la expresión regular
    return regexNumero.test(pass);
}