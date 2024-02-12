// Referencia al contenedor de mensaje de formulario.
const $frmMessage = document.getElementById('frmMessage');
// Referencia al contenedor de la lista de tareas.
const $taskList = document.getElementById('taskList');
//  Ruta actual de la ubicación.
const pathname = location.pathname;

// Verificar si la ruta de la ubicación es la página de inicio '/'.
if ( pathname === '/' ) {

    document.addEventListener('DOMContentLoaded', () => {
        // Ejecutar la función showUIOfAllTasks al cargar el contenido.
        showUIOfAllTasks();
    });

    // Agregar un event listener al botón 'btnSave' para agregar una tarea.
    document.getElementById('btnSave').addEventListener('click', (e) => {
        e.preventDefault();
        // Llamar a la función addTask al hacer clic en el botón.
        addTask();
    });
} else {
    // Asignar un evento al cargar el contenido de la pagína.
    document.addEventListener('DOMContentLoaded', async () => {
        // Ejecutar la función (showTaskToEdit).
        showTaskToEdit(pathname);
    });

    // Asignar un evento click al botón (btnHome).
    document.getElementById('btnHome').addEventListener('click', () => {
        // Ejecutar la función (redirectHomePage).
        redirectHomePage();
    })

    // Asignar un evento click al botón (btnUpdate).
    document.getElementById('btnUpdate').addEventListener('click', (e) => {
        e.preventDefault();
        // Llamar a la función (editTask).
        editTask(pathname);
    });
}

// Definición de la función (showUIOfAllTasks).
// - Muestra todas las tareas en el contenedor de lista de tareas.
function showUIOfAllTasks() {
    // Realizar una solicitud GET al servidor para obtener la lista de tareas.
    fetch('/getListTasks', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        // Desestructurar datos de la respuesta.
        const { err, errorMsg, taskList, isEmpty, emptyListMsg } = data;

        // Verificar si hay errores en la respuesta.
        if ( err ) {
            // Mostrar un mensaje de error en el contenedor de lista de tareas.
            messageInTaskListUI(errorMsg, 'danger');
        } else {

            // Verificar si la lista de tareas está vacía.
            if ( isEmpty ) {
                // Mostrar un mensaje informativo en el contenedor de lista de tareas.
                messageInTaskListUI(emptyListMsg, 'info');
            } else {
                // Construir el HTML para mostrar las tareas en el contenedor de lista de tareas.
                let html = '';

                // Iterar sobre la lista de tareas y construir el HTML correspondiente.
                taskList.forEach((task) => {
                    html += createTaskUI(task);
                });

                // Actualizar el contenido en el contenedor de lista de tareas con el HTML generado.
                $taskList.innerHTML = html;

                // Asignar los eventos de los botones de cada tarea.
                loadTaskButtons();
            }
        }
    })
    // Manejar errores en la consola en caso de fallo en la solicitud.
    .catch(err => console.error(err.message));
}

// Definición de la función (addTask).
// - Agrega una nueva tarea al contenedor de lista de tareas.
function addTask () {
    // Referenciar el formulario de agregar tarea.
    const $frm = document.getElementById('frmAddTask');

    // Establecer los valores del formulario.
    const title = $frm.elements['title'].value.trim();
    const description = $frm.elements['description'].value.trim();

    // Validar los datos del formulario y obtener un mensaje de error si es necesario.
    const errorMessage = validateFrm({title, description});

    // Verificar si hay un mensaje de error.
    if ( errorMessage ) {
        // Mostrar el mensaje de error en el contenedor de mensaje de formulario por un breve tiempo.
        messageInForm(errorMessage, 'danger');
    } else {
        // Realizar una solicitud POST al servidor para agregar una nueva tarea.
        fetch('/addTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        })
        .then(response => response.json())
        .then(data => {
            // Desestructurar datos de la respuesta.
            const { err, errorMsg, successMsg, task } = data;

            // Verificar si hay errores en la respuesta.
            if ( err ) {
                // Mostrar un mensaje de error en el contenedor de mensaje de formulario por un breve tiempo.
                messageInForm(errorMsg, 'danger');
            } else {
                // Mostrar un mensaje de éxito en el contenedor de mensaje de formulario por un breve tiempo.
                messageInForm(successMsg, 'success');

                // Restablecer el formulario después de un breve tiempo.
                $frm.reset();

                // Agregar la nueva tarea al contenedor de lista de tareas después de un breve tiempo.
                setTimeout(() => {
                    const $newTask = createTaskUI(task);
                    $taskList.insertAdjacentHTML('afterbegin', $newTask);
                    loadTaskButtons();
                }, 2000);
            }
        })
        // Manejar errores en la consola en caso de fallo en la solicitud.
        .catch( err => console.error(err.message));
    }
}

// Definición de la función (editTask).
// Edita una tarea y después redirige a la pagína de inicio para mostrar la tarea editada.
function editTask(path) {
    // Referenciar el formulario de editar tarea.
    const $frm = document.getElementById("frmEditTask");

    // Establecer los valores del formulario.
    let title = $frm.elements["title"].value.trim();
    let description = $frm.elements["description"].value.trim();

    // Validar los datos del formulario y obtener un mensaje de error si es necesario.
    let errorMessage = validateFrm({title, description});

    // Verificar si hay un mensaje de error.
    if ( errorMessage ) {
        // Mostrar el mensaje de error en el contenedor de mensaje de formulario por un breve tiempo.
        messageInForm(errorMessage, 'danger');
    } else {
        // Realizar una solicitud POST al servidor para editar una tarea actual.
        fetch(path, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        })
        .then(response => response.json())
        .then(data => {
            // Desestructurar datos de la respuesta.
            const { err, errorMsg, successMsg } = data;

            if ( err ) {
                // Mostrar un mensaje de error en el contenedor de mensaje de formulario por un breve tiempo.
                messageInForm(errorMsg, 'danger');
            } else {
                // Mostrar un mensaje de éxito en el contenedor de mensaje de formulario por un breve tiempo.
                messageInForm(successMsg, 'success');

                // Redireccionar a la pagína de inicio después de un breve tiempo.
                setTimeout(() => {
                    redirectHomePage();
                }, 2000);
            }
        })
        // Manejar errores en la consola en caso de fallo en la solicitud.
        .catch( err => console.error(err.message));
    }
}

// Definición de la función (setStateChange).
// - Cambiar el estado de una tarea en específico.
function setStateChange (path) {
    // Realizar una solicitud PUT al servidor para cambiar el estado de una tarea.
    fetch(path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        // Ejecutar la función (stateChangeResp) para manejar la respuesta del servidor.
        stateChangeResp(data);
    })
    // Manejar errores en la consola en caso de fallo en la solicitud.
    .catch( err => console.error(err.message));
}

// Definición de la función stateChangeResp.
// - Responder el cambio de estado utilizando la biblioteca Swal.
function stateChangeResp (data) {
    // Desestructurar datos de la respuesta.
    const { err, errorMsg, successMsg, task } = data;

    // Determinar el tipo de icono a mostrar según si hay errores o no.
    const icon = err ? 'error' : 'success';
    // Definir el texto del mensaje emergente según si hay errores o no.
    const text = err ? errorMsg : successMsg;

    // Mostrar un mensaje emergente (pop-up) utilizando la biblioteca Swal.
    Swal.fire({
        text,
        icon
    });

    // Verificar si no hay errores para actualizar el contenido de la tarea después de un breve tiempo.
    if ( !err ) {
        setTimeout(() => {
            showStateChangeInUI(task);
        }, 2000);
    }
}

// Definición de la función (showTaskToEdit).
// - Muestra los datos de la tarea a editar en el formulario de editar tarea.
function showTaskToEdit(path) {
    // Referenciar el formulario de editar una tarea.
    const $frm = document.getElementById('frmEditTask');
    // Establecer el ID de la tarea desde la ruta.
    const id = getTaskId(path);

    // Realizar una solicitud GET al servidor para obtener los detalles de la tarea.
    fetch(`/getTask/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
        // Desestructurar los datos de la respuesta.
        const { task } = data;

        // Establecer los valores de título y descripción en el formulario de edición.
        $frm.elements['title'].value = task.title;
        $frm.elements['description'].value = task.description;
    })
    // Manejar errores en la consola en caso de fallo en la solicitud.
    .catch(err => console.error(err.message));
}

// Definición de la función (removeTask).
// - Remueve una tarea en especifíco del contenedor de la lista de tareas.
function removeTask(path) {
    // Realizar una solicitud DELETE al servidor para eliminar una tarea.
    fetch(path, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            // Desestructurar los datos de la respuesta.
            const { err, errorMsg, successMsg, id } = data;

            // Determinar el tipo de icono a mostrar según si hay errores o no.
            const text = err ? errorMsg : successMsg;
            // Definir el texto del mensaje emergente según si hay errores o no.
            const icon = err ? 'error' : 'success';

            // Mostrar un mensaje emergente (pop-up) utilizando la biblioteca Swal.
            Swal.fire({
                text,
                icon
            });

            // Verificar si no hay errores para eliminar la tarea del contenedor de lista de tareas después de un breve tiempo.
            if ( !err ) {
                setTimeout(() => {
                    document.getElementById(`task${id}`).remove();
                }, 2000);
            }
        })
        // Manejar errores en la consola en caso de fallo en la solicitud.
        .catch( err => console.error(err.message));
}

// Definición de la función (validateTask).
// - Redirige a la pagína de edición.
function validateTask(path) {
    // Establecer el ID de la tarea desde la ruta.
    const id = getTaskId(path);

    // Realizar una solicitud GET al servidor para obtener información sobre la tarea.
    fetch(`/getTask/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        // Desestructurar los datos de la respuesta.
        const { err, errorMsg } = data;

        // Verificar si hay errores y mostrar un mensaje emergente (pop-up) en caso afirmativo.
        if ( err ) {
            Swal.fire({
                text: errorMsg,
                icon: 'error'
            });
        } else {
            // Redirigir a la página de edición si no hay errores.
            location.pathname = path;
            showEditPage(path);
        }
    })
    // Manejar errores en la consola en caso de fallo en la solicitud.
    .catch( err => console.error(err.message));
}

// Definición de la función (showEditPage).
function showEditPage(path) {
    // Realizar una solicitud GET al servidor para obtener la página de edición.
    fetch(path, {
        'method': 'GET'
    })
    .then(response => response)
    // Manejar errores en la consola en caso de fallo en la solicitud.
    .catch(err => console.error(err.message));
}

// Definición de la función (messageInTaskListUI).
function messageInTaskListUI (message, type) {
    // Actualizar el contenido del contenedor de la lista de tareas.
    $taskList.innerHTML = `
        <div class='alert alert-${type} text-center' role='alert'>
            ${message}
        </div>
    `;
}

// Definición de la función (messageInForm).
function messageInForm (message, type) {
    // Mostrar el contenido del contenedor de mensaje de formulario.
    $frmMessage.style.display = 'block';
    $frmMessage.setAttribute('class', `alert alert-${type} mt-3` );
    $frmMessage.setAttribute('role', 'alert');
    $frmMessage.textContent = `${message}`;

    // Ocultar el contenido del contenedor de mensaje de formulario después de un breve tiempo.
    setTimeout(() => {
        $frmMessage.style.display = 'none';
    }, 2000 );
}

// Definición de la función (validateFrm).
const validateFrm = (task) => {
    // Verificar si el título no es nulo.
    if ( !task.title ) {
        return 'The title is required';
    }

    // Verificar si el título tiene menos de 5 caracteres.
    if ( task.title.length < 5 ) {
        return 'The title must contain 5 or more characters';
    }

    // Verificar si la descripción no es nulo.
    if ( !task.description ) {
        return 'The description is required';
    }

    // Verificar si la descripción tiene menos de 8 caracteres.
    if ( task.description.length < 8 ) {
        return 'The description must contain 8 or more characters';
    }

    // Devolver null indicando que no hay errores.
    return null;
}

// Definición de la función (loadTaskButtons).
function loadTaskButtons() {
    // Establecer listas de botones de edición, cambio de estado y eliminación.
    const editBtnList = document.querySelectorAll('.btn-edit');
    const stateBtnList = document.querySelectorAll('.btn-state');
    const removeBtnList = document.querySelectorAll('.btn-remove');

    // Asignar evento clíck a los botones de edición.
    editBtnList.forEach((btn) => {
        btn.addEventListener('click',  (e) => {
            e.preventDefault();
            // Establecer ruta del botón.
            const path = btn.getAttribute('href');
            // Ejecutar la función (validateTask) para verificar y procesar la edición.
            validateTask(path);
        });
    });

    // Asignar evento clíck a los botones de cambio de estado.
    stateBtnList.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Establecer ruta del botón.
            const path = btn.getAttribute('href');
            // Ejecutar la función (setStateChange) para cambiar el estado de la tarea.
            setStateChange(path);
        });
    });

    // Asignar evento clíck a los botones de cambio de eliminación.
    removeBtnList.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Establecer ruta del botón.
            const path = btn.getAttribute('href');
            // Ejecutar la función (removeTask) para eliminar la tarea.
            removeTask(path);
        });
    });
}

// Definición de la función (createTaskUI).
const createTaskUI = (task) => {

    // Desestructurar las propiedades de la tarea.
    const {id, title, description, state} = task;

    // Retornar una cadena de texto HTML representando la tarea.
    return `
        <div class='alert alert-${getTaskColor(state)} row mb-3' role='alert' id='task${id}'>
            <div class='col-md-2 center-element'>
                <span class='material-symbols-outlined'>
                    task
                </span>
            </div>
            <div class='col-md-8'>
                <p class='m-0'><b>Title: </b>${title}</p>
                <p class='m-0'><b>Description: </b>${description}</p>
                <p class='m-0'><b>State: </b>${getStateName(state)}</p>
            </div>
            <div class='col-md-2 center-element'>
                <a href='/${getStatePath(state)}Task/${id}' class='btn-state center-element'>
                    <span class='material-symbols-outlined'>
                        ${getStateIcon(state)}
                    </span>
                </a>
                <a href='/editTask/${id}' class='btn-edit center-element'>
                    <span class='material-symbols-outlined'>
                        cached
                    </span>
                </a>
                <a href='/removeTask/${id}' class='btn-remove center-element'>
                    <span class='material-symbols-outlined'>
                        delete
                    </span>
                </a>
            </div>
        </div>
    `;
};
// Definición de la función (showStateChangeInUI).
function showStateChangeInUI(task) {
    // Desestructurar las propiedades de la tarea.
    const {id, state} = task;

    // Obtener el elemento HTML de la tarea por su ID.
    // Actualizar la clase del elemento con el nuevo color de estado.
    document.getElementById(`task${id}`)
        .setAttribute('class', `alert alert-${getTaskColor(state)} row mb-3`);

    // Obtener los elementos dentro de la tarea que contienen el botón de estado y el texto de estado.
    const $btnState = document.querySelectorAll(`#task${id} a`)[0];
    const $textState = document.querySelectorAll(`#task${id} p`)[2];

    // Actualizar el enlace del botón de estado con el nuevo path y el contenido del icono.
    $btnState.setAttribute('href', `${getStatePath(state)}Task/${id}`);
    $btnState.querySelector('span').textContent = getStateIcon(state);

    // Actualizar el texto de estado con el nuevo nombre de estado.
    $textState.innerHTML = `<b>State: </b>${getStateName(state)}`;
}

// Función getTaskColor.
// - Devuelve el color de la alerta según el estado de la tarea.
const getTaskColor = (state) => (state ? 'info' : 'warning');

// Función getStateName.
// - Devuelve el nombre del estado según el estado de la tarea.
const getStateName = (state) => (state ? 'Completed' : 'Uncompleted');

// Función getStatePath
// - Devuelve el path para el estado opuesto según el estado de la tarea.
const getStatePath = (state) => (state ? 'uncompleted' : 'completed');

// Función getStateIcon
// - Devuelve el nombre del icono según el estado de la tarea.
const getStateIcon = (state) => (state ? 'close' : 'done');

// Función redirectHomePage
// - Redirige a la página de inicio.
const redirectHomePage = () => (location.pathname = '/');

// Función getTaskId
// - Extrae y devuelve el ID de la tarea de la ruta proporcionada.
const getTaskId = (path) => {
    const match = path.match(/\/(\d+)$/);
    return match ? match[1] : null;
}

/*
const createTaskUI = (task) => {
    const {id, title, description, state} = task;
    const $div = document.createElement('div');
    $div.setAttribute('class', `alert alert-${getColorTask(state)} row mb-3`);
    $div.setAttribute('role', 'alert');
    $div.setAttribute('id', `task${id}`);

$div.innerHTML = `
    <div class="col-md-2 center-element">
        <span class="material-symbols-outlined ">
            task
        </span>
    </div>
    <div class="col-md-8">
            <p class="m-0"><b>Title: </b>${title}</p>
            <p class="m-0"><b>Description: </b>${description}</p>
            <p class="m-0"><b>State: </b>${getNameState(state)}</p>
    </div>
    <div class="col-md-2 center-element">
            <a href='/${getPathState(state)}Task/${id}' class="btn-state center-element">
                <span class="material-symbols-outlined">
                    ${getIconState(state)}
                </span>
            </a>
            <a href="/editTask/${id}" class="btn-edit center-element">
                <span class="material-symbols-outlined">
                    cached
                </span>
            </a>
            <a href="/remove/${id}" class="btn-remove center-element">
                <span class="material-symbols-outlined">
                    delete
                </span>
            </a>
    </div>
`;

return $div;
}
 */

