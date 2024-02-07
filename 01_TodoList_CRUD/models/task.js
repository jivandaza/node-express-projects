// Importar el módulo fs para manejar operaciones de archivo
import fs from 'fs';

const fileName = 'tasks.json';

// Definir la clase Task
class Task {

    // Constructor para crear instancias de la clase Task
    constructor(id, title, description, state) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.state = state;
    }

    // Método estático para obtener la lista de todas las tareas
    static getAllList = ()=> {
        const errorMsg = 'Error loading task list...';
        let { err, taskList } = readFile();
        try{
            if ( err ) {
                throw new Error(errorMsg);
            }

            // Paso 2: Filtrar las tareas que pasan la validación
            const filteredTasks = taskList.tasks.filter((task) =>
                    !new Task(task.id, task.title, task.description, task.state).validateTask());

            const isEmpty = filteredTasks.length === 0;
            const emptyListMsg = 'There are no tasks to show...';

            const reversedArray = filteredTasks.reverse();

            // Paso 3: Convertir la lista filtrada a formato JSON y devolverla como cadena
            return { err, 'taskList': reversedArray, isEmpty, emptyListMsg };
        } catch (error) {
            // Manejar cualquier error que pueda ocurrir durante la operación y devolver el mensaje de error
            console.error(error.message);
            return { err, errorMsg };
        }
    }

    static getTask(id) {
        const { err, errorMsg, index, taskList } = existTask(id, 'edit');
        try {
            if ( err ) {
                throw new Error(errorMsg);
            }

            const task = taskList.tasks[index];

            return { err, task };
        } catch (error) {
            return { err, errorMsg };
        }
    }

    // Método estático para agregar una nueva tarea en la lista de tareas
    static add = (title, description) => {
        let { err, taskList } = readFile();
        try {
            if ( err ) {
                throw new Error('An error occurred while saving a task');
            }

            // Paso 2: Crear una nueva tarea con un ID único
            let task = new Task(taskList.tasks.length + 1, title, description, false);

            // Paso 3: Lanzar un error si la tarea no pasa la validación
            if ( task.validateTask() ) {
                err = true;
                throw new Error(task.validateTask());
            }

            // Paso 4: Agregar la tarea a la lista
            taskList.tasks.push(task);

            saveFileData(taskList);

            return { err, 'successMsg': `Task saved with id: ${task.id}`, 'taskRes': task};
        } catch (error) {
            // Manejar cualquier error que pueda ocurrir durante la operación y devolver el mensaje de error
            console.log(error.message);
            return { err, 'errorMsg': error.message };
        }
    }

    // Método estático para editar una tarea en la lista de tareas
    static edit = ( id, title, description ) => {
        let { err, errorMsg, index, taskList } = existTask(id, 'update');
        try {
            if ( err ) {
                throw new Error(errorMsg);
            }

            const { state } = taskList.tasks[index];

            // Paso 2: Crear una nueva instancia de Task con los datos de la tarea a editar
            const editTask = new Task( id, title, description, state );

            // Paso 3: Validar la nueva tarea, si no pasa la validación, lanzar un error con el mensaje de validación
            if ( editTask.validateTask() ) {
                err = true;
                errorMsg = editTask.validateTask();
                throw new Error(errorMsg);
            }

            taskList.tasks[index].title = title;
            taskList.tasks[index].description = description;

            // Paso 5: Escribir los datos actualizados en el archivo
            saveFileData(taskList);

            const successMsg = `Task update with id: ${id}`;

            return { err, successMsg };
        } catch ( err ) {
            // Manejar cualquier error que pueda ocurrir durante la operación y devolver el mensaje de error
            console.log(err.message);
            return { err, errorMsg };
        }
    }

    static completed = (id) => {
        const { err, errorMsg, index, taskList } = existTask(id, 'completed');
        try {
            if ( err ) {
                throw new Error(errorMsg);
            }

            taskList.tasks[index].state = true;

            saveFileData(taskList);

            const successMsg = `Task completed with id: ${id}`;
            const task = taskList.tasks[index];

            return { err, successMsg, task };
        } catch (error) {
            return { err, errorMsg };
        }
    }

    // Método estático para marcar una tarea como no completada en la lista de tareas
    static uncompleted = (id) => {
        const { err, errorMsg, index, taskList } = existTask(id, 'uncompleted');
        try {
            if ( err ) {
                throw new Error(errorMsg);
            }

            taskList.tasks[index].state = false;

            saveFileData(taskList);

            const successMsg = `Task uncompleted with id: ${id}`;
            const task = taskList.tasks[index];

            return { err, successMsg, task };
        } catch (error) {
            return { err, errorMsg };
        }
    }

    static remove = (id) => {
        let { err, errorMsg, taskList } = existTask(id, 'remove');
        try {
            if ( err ) {
                throw new Error(errorMsg);
            }

            taskList.tasks = taskList.tasks.filter((task) => task.id !== id);

            saveFileData(taskList);

            const successMsg = `Task remove with id: ${id}`;

            return { err, successMsg, id };
        } catch (error) {
            return { err, errorMsg };
        }
    }

    // Método para validar los atributos de una tarea
    validateTask() {
        // Paso 1: Validar si el Id está presente
        if ( !this.id ) {
            return  'The Id is required';
        }

        // Paso 2: Validar si el Id es un número
        if ( !(typeof this.id === 'number' && !isNaN(this.id)) ) {
            return 'The Id is not a number';
        }

        // Paso 3: Validar si el Title está presente
        if ( !this.title ) {
            return 'The Title is required';
        }

        // Paso 4: Validar si el Title es una cadena de texto
        if ( !(Task.isString(this.title)) ) {
            return 'The Title is not a text string';
        }

        // Paso 5: Validar si el Title tiene al menos 5 caracteres
        if ( this.title.length < 5 ) {
            return 'The Title must contain 5 or more characters';
        }

        // Paso 6: Validar si la Description está presente
        if ( !this.description ) {
            return 'The Description is required';
        }

        // Paso 7: Validar si la Description es una cadena de texto
        if ( !(Task.isString(this.description)) ) {
            return 'The Description is not a text string';
        }

        // Paso 8: Validar si la Description tiene al menos 8 caracteres
        if ( this.description.length < 8 ) {
            return 'The Description must contain 8 or more characters';
        }

        // Paso 9: Validar si el State está presente
        if ( this.state === undefined ) {
            return 'The State is required';
        }

        // Paso 10: Validar si el State es un booleano
        if ( !(typeof this.state === 'boolean') ) {
            return 'The State is not a boolean';
        }

        // Paso 11: Si todas las validaciones pasan, devolver null indicando que no hay errores
        return null;
    }

    // Método estático para verificar si un valor es una cadena de texto
    static isString(str) {
        // Verificar si el tipo de 'str' es 'string'
        return (typeof str === 'string');
    }
}

// Método estático para leer datos desde un archivo
const readFile = () => {
    try {
        if ( fs.existsSync(fileName) ) {
            return { 'err': false, 'taskList': JSON.parse(fs.readFileSync(fileName, 'utf-8')) };
        } else {
            throw new Error(`Error reading ${fileName} file...`);
        }
    } catch (err) {
        console.error(err.message);
        return { 'err': true };
    }
};

const existFile = (title) => {
    const { err, taskList } = readFile();
    const errorMsg = `An error occurred while ${title} a task`;

    try {
        if ( err ) {
            throw new Error(errorMsg);
        }

        return { err, taskList };
    } catch (error) {
        console.error(error.message);
        return { err, errorMsg }
    }
}

const existTask = (id, title) => {
    let { err, errorMsg, taskList } = existFile(title);

    try {
        if ( err ) {
            throw new Error(errorMsg);
        }

        const index = taskList.tasks.findIndex((taskItem)=> taskItem.id === id);

        if ( index === -1 ) {
            err = true;
            errorMsg = `The task with Id ${id} does not exist`;

            throw new Error(errorMsg);
        }

        return { err, index, taskList };
    } catch (error) {
        console.error(error.message);
        return { err, errorMsg };
    }
}

// Método estático para escribir datos en un archivo
const saveFileData = (data) => (fs.writeFileSync(fileName, JSON.stringify(data), 'utf-8' ));

// Exportar la clase Task como un objeto desde el módulo
export default {
    Task,
    existTask
}