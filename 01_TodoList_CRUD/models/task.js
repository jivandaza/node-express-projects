// Importar el módulo fs para manejar operaciones de archivo.
import fs from 'fs';

// Se establece el nombre del archivo utilizado para almacenar los datos de las tareas en formato JSON.
const fileName = 'tasks.json';

// Definición de la clase Task.
class Task {

    // Constructor para crear instancias de la clase Task.
    constructor(id, title, description, state) {
        // id: Valor entero único sin repetir, no recibe valores nulos.
        this.id = id;
        // title: Valor cadena de texto, no recibe valores nulos.
        this.title = title;
        // description: Valor cadena de texto, no recibe valores nulos.
        this.description = description;
        // state: Valor booleano, no recibe valores nulos.
        this.state = state;
    }

    // Función estática para obtener la lista de tareas filtradas y ordenadas inversamente.
    static getListTasks = ()=> {
        // Se establece un mensaje de error predeterminado para la carga de la lista de tareas.
        const errorMsg = 'Error loading task list';
        // Se utiliza getFileData para obtener los datos del archivo que contiene las tareas.
        // - Desestructurar la función con sus propiedades.
        let { err, taskList } = getFileData();

        try{
            // Verificar si hubo un error al obtener los datos del archivo.
            if ( err ) {
                // Se lanza una excepción con el mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Se filtran las tareas para incluir solo aquellas que pasan la validación.
            const filteredTasks = taskList.tasks.filter((task) =>
                    !new Task(task.id, task.title, task.description, task.state).validateTask());

            // Se verifica si la lista filtrada está vacía.
            const isEmpty = filteredTasks.length === 0;
            // Se establece un mensaje de lista vacía predeterminado.
            const emptyListMsg = 'There are no tasks to show';

            // Se invierte el orden de la lista filtrada para que las tareas más recientes aparezcan primero.
            const reversedArray = filteredTasks.reverse();

            // Se devuelve un objeto con las siguientes propiedades.
            return { err, 'taskList': reversedArray, isEmpty, emptyListMsg };
        } catch (error) {
            // Si hay un error durante la operación, se imprime en la consola.
            console.error(error);
            // Se devuelve un objeto con las siguientes propiedades.
            return { err, errorMsg };
        }
    }

    // Función estática para obtener una tarea específica por su ID.
    static getTask(id) {
        // Se utiliza existsTask para verificar la existencia de la tarea.
        // - Desestructurar la función con sus propiedades.
        const { err, errorMsg, index, taskList } = Task.existsTask(id, 'edit');

        try {
            // Verificar si hubo un error al obtener la tarea.
            if ( err ) {
                // Se lanza una excepción con el mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Se obtiene la tarea específica según su índice en la lista de tareas.
            const task = taskList.tasks[index];

            // Se devuelve un objeto con las siguientes propiedades.
            return { err, task };
        } catch (error) {
            // Si hay un error durante la operación, se imprime en la consola.
            console.error(error);
            // Se devuelve un objeto con las siguientes propiedades.
            return { err, errorMsg };
        }
    }

    // Función estática para agregar una nueva tarea en la lista de tareas.
    static addTask = (title, description) => {
        // Se establece un mensaje de error predeterminado al momento de agregar una tarea al archivo.
        let errorMsg = 'An error occurred while saving a task';
        // Se utiliza getFileData para obtener los datos del archivo que contiene las tareas.
        // - Desestructurar la función con sus propiedades.
        let { err, taskList } = getFileData();

        try {
            // Verificar si hubo un error al obtener los datos del archivo.
            if ( err ) {
                // Se lanza una excepción con el mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Crea una nueva instancia de Task con un ID único y los parámetros proporcionados (title, description, false).
            let task = new Task(taskList.tasks.length + 1, title, description, false);

            // Si la nueva tarea no pasa la validación (según el método validateTask).
            if ( task.validateTask() ) {
                // Se establece el error.
                err = true;
                // Se establece un nuevo mensaje de error con el mensaje de validación.
                errorMsg = task.validateTask();

                // Se lanza una excepción con el nuevo mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Agrega la nueva tarea a la lista de tareas.
            taskList.tasks.push(task);

            // Guarda la lista actualizada en el archivo.
            saveFileData(taskList);

            // Se devuelve un objeto con las siguientes propiedades.
            return { err, 'successMsg': `Task saved with ID: [${task.id}]`, task};
        } catch (error) {
            // Si hay un error durante la operación, se imprime en la consola.
            console.error(error);
            // Se devuelve un objeto con las siguientes propiedades.
            return { err, errorMsg };
        }
    }

    // Función estática para editar una tarea en la lista de tareas.
    static editTask = ( id, title, description ) => {
        // Se utiliza existsTask para verificar la existencia de la tarea.
        // - Desestructurar la función con sus propiedades.
        let { err, errorMsg, index, taskList } = Task.existsTask(id, 'update');

        try {
            // Verificar si hubo un error al obtener la tarea.
            if ( err ) {
                // Se lanza una excepción con el mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Se establece el estado de la tarea a editar.
            const { state } = taskList.tasks[index];

            // Crea una nueva instancia de Task con los parámetros proporcionados (id, title, description, state).
            const editTask = new Task( id, title, description, state );

            // Si la nueva instancia de Task no pasa la validación (según el método validateTask).
            if ( editTask.validateTask() ) {
                // Se establece el error.
                err = true;
                // Se establece un nuevo mensaje de error con el mensaje de validación.
                errorMsg = editTask.validateTask();

                // Se lanza una excepción con el nuevo mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Actualiza el título y la descripción de la tarea en la lista de tareas.
            taskList.tasks[index].title = title;
            taskList.tasks[index].description = description;

            // Guarda la lista actualizada en el archivo.
            saveFileData(taskList);

            // Se devuelve un objeto con las siguientes propiedades.
            return { err, 'successMsg': `Task update with ID: [${id}]` };
        } catch (error) {
            // Si hay un error durante la operación, se imprime en la consola.
            console.error(error);
            // Se devuelve un objeto con las siguientes propiedades.
            return { err, errorMsg };
        }
    }

    // Función estática para marcar una tarea como completada en la lista de tareas.
    static completedTask = (id) => {
        // Se utiliza existsTask para verificar la existencia de la tarea.
        // - Desestructurar la función con sus propiedades.
        const { err, errorMsg, index, taskList } = Task.existsTask(id, 'completed');

        try {
            // Verificar si hubo un error al obtener la tarea.
            if ( err ) {
                // Se lanza una excepción con el mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Marca la tarea como completada cambiando su estado a true.
            taskList.tasks[index].state = true;

            // Guarda la lista actualizada en el archivo.
            saveFileData(taskList);

            // Obtiene la tarea actualizada.
            const task = taskList.tasks[index];

            // Se devuelve un objeto con las siguientes propiedades.
            return { err, task, 'successMsg': `Task completed with ID: [${id}]` };
        } catch (error) {
            // Si hay un error durante la operación, se imprime en la consola.
            console.error(error);
            // Se devuelve un objeto con las siguientes propiedades.
            return { err, errorMsg };
        }
    }

    // Función estática para marcar una tarea como no completada en la lista de tareas.
    static uncompletedTask = (id) => {
        // Se utiliza existsTask para verificar la existencia de la tarea.
        // - Desestructurar la función con sus propiedades.
        const { err, errorMsg, index, taskList } = Task.existsTask(id, 'uncompleted');

        try {
            // Verificar si hubo un error al obtener la tarea.
            if ( err ) {
                // Se lanza una excepción con el mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Marca la tarea como completada cambiando su estado a false.
            taskList.tasks[index].state = false;

            // Guarda la lista actualizada en el archivo.
            saveFileData(taskList);

            // Obtiene la tarea actualizada.
            const task = taskList.tasks[index];

            // Se devuelve un objeto con las siguientes propiedades.
            return { err, task, 'successMsg': `Task uncompleted with ID: [${id}]` };
        } catch (error) {
            // Si hay un error durante la operación, se imprime en la consola.
            console.error(error);
            // Se devuelve un objeto con las siguientes propiedades.
            return { err, errorMsg };
        }
    }

    // Método estático para eliminar una tarea de la lista de tareas.
    static removeTask = (id) => {
        // Se utiliza existsTask para verificar la existencia de la tarea.
        // - Desestructurar la función con sus propiedades.
        let { err, errorMsg, taskList } = Task.existsTask(id, 'remove');

        try {
            // Verificar si hubo un error al obtener la tarea.
            if ( err ) {
                // Se lanza una excepción con el mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Filtra la lista de tareas para excluir la tarea con el ID proporcionado.
            taskList.tasks = taskList.tasks.filter((task) => task.id !== id);

            // Guarda la lista actualizada en el archivo.
            saveFileData(taskList);

            // Se devuelve un objeto con las siguientes propiedades.
            return { err, id, 'successMsg': `Task remove with ID: [${id}]` };
        } catch (error) {
            // Si hay un error durante la operación, se imprime en la consola.
            console.error(error);
            // Se devuelve un objeto con las siguientes propiedades.
            return { err, errorMsg };
        }
    }

    // Función estática para verificar la existencia de una tarea en la lista de tareas.
    static existsTask (id, title) {
        // Se utiliza existFile para obtener los datos del archivo y manejar posibles errores.
        // - Desestructurar la función con sus propiedades.
        let { err, errorMsg, taskList } = existFile(title);

        try {
            // Verificar si hubo un error al obtener los datos del archivo.
            if ( err ) {
                // Se lanza una excepción con el mensaje de error personalizado.
                throw new Error(errorMsg);
            }

            // Se establece el índice de la tarea en la lista mediante el ID proporcionado.
            const index = taskList.tasks.findIndex((taskItem)=> taskItem.id === id);

            // Verificar si la tarea no fue encontrada.
            if ( index === -1 ) {
                // Se establece el error.
                err = true;
                // Se establece un nuevo mensaje de error predeterminado que la tarea con el ID ingresado no existe.
                errorMsg = `The task with ID: [${id}] does not exists`;

                // Se lanza una excepción con el nuevo mensaje de error predeterminado.
                throw new Error(errorMsg);
            }

            // Se devuelve un objeto con las siguientes propiedades.
            return { err, index, taskList };
        } catch (error) {
            // Si hay un error durante la operación, se imprime en la consola.
            console.error(error);
            // Se devuelve un objeto con las siguientes propiedades.
            return { err, errorMsg };
        }
    }

    // Método para validar los atributos de una tarea.
    validateTask() {
        // Verificar si el ID es nulo.
        if ( !this.id ) {
            return  'The Id is required';
        }

        // Verificar si el ID es un número.
        if ( !(typeof this.id === 'number' && !isNaN(this.id)) ) {
            return 'The Id is not a number';
        }

        // Verificar si el Title es nulo.
        if ( !this.title ) {
            return 'The Title is required';
        }

        // Verificar si el Title es una cadena de texto.
        if ( !(isString(this.title)) ) {
            return 'The Title is not a text string';
        }

        // Verificar si el Title tiene al menos 5 caracteres.
        if ( this.title.length < 5 ) {
            return 'The Title must contain 5 or more characters';
        }

        // Verificar si la Description es nulo.
        if ( !this.description ) {
            return 'The Description is required';
        }

        // Verificar si la Description es una cadena de texto.
        if ( !(isString(this.description)) ) {
            return 'The Description is not a text string';
        }

        // Verificar si la Description tiene al menos 8 caracteres.
        if ( this.description.length < 8 ) {
            return 'The Description must contain 8 or more characters';
        }

        // Verificar si el State es nulo.
        if ( this.state === undefined ) {
            return 'The State is required';
        }

        // Verificar si el State es un booleano.
        if ( !(typeof this.state === 'boolean') ) {
            return 'The State is not a boolean';
        }

        // Si todas las verificaciones pasan, devolver null indicando que no hay errores.
        return null;
    }
}

// Función para obtener los datos del archivo.
const getFileData = () => {
    try {
        // Verificar si el archivo existe.
        if ( fs.existsSync(fileName) ) {
            // Se devuelve un objeto con las siguientes propiedades.
            return { 'err': false, 'taskList': JSON.parse(fs.readFileSync(fileName, 'utf-8')) };
        } else {
            // Se lanza una excepción con un mensaje de error.
            throw new Error(`Error reading ${fileName} file`);
        }
    } catch (error) {
        // Si hay un error durante la operación, se imprime en la consola.
        console.error(error.message);
        // Se devuelve un objeto con la siguiente propiedad.
        return { 'err': true };
    }
};

// Función para guardar datos en el archivo.
// - Utiliza fs.writeFileSync para escribir los datos en el archivo en formato JSON.
const saveFileData = (data) => (fs.writeFileSync(fileName, JSON.stringify(data), 'utf-8' ));

// Función para verificar la existencia del archivo y obtener los datos del archivo.
const existFile = (title) => {
    // Se establece un mensaje de error personalizado al obtener los datos del archivo.
    const errorMsg = `An error occurred while ${title} a task`;
    // Se utiliza getFileData para obtener los datos del archivo.
    // - Desestructurar la función con sus propiedades.
    const { err, taskList } = getFileData();

    try {
        // Verificar si hubo un error al obtener los datos del archivo.
        if ( err ) {
            // Se lanza una excepción con el mensaje de error personalizado.
            throw new Error(errorMsg);
        }

        // Se devuelve un objeto con las siguientes propiedades.
        return { err, taskList };
    } catch (error) {
        // Si hay un error durante la operación, se imprime en la consola.
        console.error(error.message);
        // Se devuelve un objeto con las siguientes propiedades.
        return { err, errorMsg }
    }
}

// Función para verificar si un valor es una cadena de texto
// - Devuelve true si es una cadena de texto, en caso contrario devuelve false
const isString = (str) => (typeof str === 'string');

// Exportar la clase Task como un objeto desde el módulo
export default {
    Task
}