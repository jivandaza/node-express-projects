import express from 'express';
import bodyParser from 'body-parser';
import taskController from './controllers/taskController.js';

const app = express(),
    hostname = 'localhost',
    port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./public'));

app.get('/', taskController.getPageIndex);
app.get('/listTasks', taskController.getAllTasks);
app.post('/addTask', taskController.addTask);
app.get('/editTask/:id', taskController.getPageEdit);
app.get('/getTask/:id', taskController.getTask);
app.put('/editTask/:id', taskController.editTask);
app.put('/completedTask/:id', taskController.completedTask);
app.put('/uncompletedTask/:id', taskController.uncompletedTask);
app.delete('/removeTask/:id', taskController.removeTask);

app.use(taskController.getPageError);

app.listen(port, () => {
    console.log(`\n\tLa aplicación se inicio en http://${hostname}:${port}\n`);
});