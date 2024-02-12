// Importar los módulos necesarios
import express from 'express';
import bodyParser from 'body-parser';
import taskController from './controllers/taskController.js';

// Configurar la aplicación Express
const app = express();
const hostname = 'localhost';
const port = 3000;

// Configurar middleware para manejar JSON y datos de formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Configurar el manejo de archivos estáticos en la carpeta 'public'
app.use(express.static('./public'));

// Definir rutas y asociarlas a funciones del controlador
app.get('/', taskController.getIndexPage);
app.get('/editTask/:id', taskController.getEditPage);
app.get('/getListTasks', taskController.getListTasks);
app.get('/getTask/:id', taskController.getTask);
app.post('/addTask', taskController.addTask);
app.put('/editTask/:id', taskController.editTask);
app.put('/completedTask/:id', taskController.completedTask);
app.put('/uncompletedTask/:id', taskController.uncompletedTask);
app.delete('/removeTask/:id', taskController.removeTask);

// Configurar middleware para manejar errores
app.use(taskController.getErrorPage);

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`\n\tLa aplicación se inicio en http://${hostname}:${port}\n`);
});