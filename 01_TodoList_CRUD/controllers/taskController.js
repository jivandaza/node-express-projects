// Importar los módulos necesarios.
import taskMod from './../models/task.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtiene la ruta del directorio actual (__dirname) utilizando fileURLToPath y new URL.
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Controlador para enviar el archivo index.html al cliente.
const getIndexPage = (req, res) => {
    // Envía el archivo index.html al cliente.
    res.sendFile('./public/index.html');
}

// Controlador para enviar el archivo error.html al cliente.
const getErrorPage = (req, res) => {
    // Construye la ruta completa al archivo error.html.
    const filePath = path.join(__dirname, '../public/pages/error.html');

    // Envía el archivo error.html al cliente.
    res.sendFile(filePath);
}

// Controlador para obtener la página de edición de una tarea (getEditPage).
const getEditPage = (req, res) => {
    // Obtiene el parámetro de la URL que representa el ID de la tarea a editar.
    const id = parseInt(req.params.id);
    // Se utiliza existsTask para verificar la existencia de la tarea.
    // - Desestructurar la función con sus propiedades.
    const { err, index } = taskMod.Task.existsTask(id, 'edit');

    // Verificar si hubo un error al obtener la tarea.
    if ( err ) {
        // Redirige a la página principal en caso de error.
        res.redirect('/');
    } else {
        // Inicializa la variable filePath para contener la ruta del archivo que se enviará al cliente.
        let filePath;

        // Verifica si la tarea no existe (índice igual a -1).
        if ( index === -1 ) {
            // Si la tarea no existe, establece la ruta al archivo error.html.
            filePath = path.join(__dirname, '../public/pages/error.html');
        } else {
            // Si la tarea existe, establece la ruta al archivo edit.html.
            filePath = path.join(__dirname, '../public/pages/edit.html');
        }

        // Envía el archivo correspondiente al cliente.
        res.sendFile(filePath);
    }
}

// Controlador para obtener la lista de tareas (getListTasks).
const getListTasks = (req, res) => {
    // Devuelve la lista de tareas utilizando la función getListTasks de la clase Task.
    // - Envía el objeto correspondiente al cliente.
    res.status(200).send(taskMod.Task.getListTasks());
}

// Controlador para obtener una tarea específica (getTask).
const getTask = ( req, res ) => {
    // Obtiene el ID de la tarea como un número entero desde los parámetros de la solicitud.
    const id = parseInt(req.params.id);

    // Devuelve la tarea correspondiente utilizando la función getTask de la clase Task.
    // - Envía el objeto correspondiente al cliente.
    res.status(200).send(taskMod.Task.getTask(id));
}

// Controlador para agregar una nueva tarea (addTask).
const addTask = (req, res) => {
    // Obtiene el título y la descripción de la tarea desde el cuerpo de la solicitud.
    // - Trima los espacios en blanco alrededor del título y la descripción.
    const title = req.body.title.trim();
    const description = req.body.description.trim();

    // Agrega la tarea utilizando la función addTask de la clase Task.
    // - Envía el objeto correspondiente al cliente.
    res.status(200).send(taskMod.Task.addTask(title, description));
}

// Controlador para editar una tarea existente (editTask).
const editTask = (req, res) => {
    // Obtiene el ID de la tarea como un número entero desde los parámetros de la solicitud.
    const id = parseInt(req.params.id);

    // Obtiene el título y la descripción de la tarea desde el cuerpo de la solicitud.
    // - Trima los espacios en blanco alrededor del título y la descripción.
    const title = req.body.title.trim();
    const description = req.body.description.trim();

    // Edita la tarea utilizando la función editTask de la clase Task.
    // - Envía el objeto correspondiente al cliente.
    res.status(200).send(taskMod.Task.editTask(id, title, description));
}

// Controlador para marcar una tarea como completada (completedTask).
const completedTask = (req, res) => {
    // Obtiene el ID de la tarea como un número entero desde los parámetros de la solicitud.
    const id = parseInt(req.params.id);

    // Marca la tarea como completada utilizando la función completedTask de la clase Task.
    // - Envía el objeto correspondiente al cliente.
    res.status(200).send(taskMod.Task.completedTask(id));
}

// Controlador para marcar una tarea como no completada (uncompletedTask).
const uncompletedTask = (req, res) => {
    // Obtiene el ID de la tarea como un número entero desde los parámetros de la solicitud.
    // - Envía el objeto correspondiente al cliente.
    const id = parseInt(req.params.id);

    // Marca la tarea como no completada utilizando la función uncompletedTask de la clase Task.
    // - Envía el objeto correspondiente al cliente.
    res.status(200).send(taskMod.Task.uncompletedTask(id));
}

// Controlador para eliminar una tarea (removeTask).
const removeTask = (req, res) => {
    // Obtiene el ID de la tarea como un número entero desde los parámetros de la solicitud.
    const id = parseInt(req.params.id);

    // Elimina la tarea utilizando la función removeTask de la clase Task.
    // - Envía el objeto correspondiente al cliente.
    res.status(200).send(taskMod.Task.removeTask(id));
}

// Exportar los controladores necesarios.
export default {
    getIndexPage,
    getErrorPage,
    getEditPage,
    getListTasks,
    getTask,
    addTask,
    editTask,
    completedTask,
    uncompletedTask,
    removeTask
}