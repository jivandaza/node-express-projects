import task from './../models/task.js';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const getPageIndex = (req, res) => {
    res.setHeader('Content-type', 'text/html');
    res.sendFile('./public/index.html');
}

const getPageError = (req, res) => {
    const filePath = path.join(__dirname, '../public/pages/error.html');

    res.setHeader('Content-type', 'text/html');
    res.sendFile(filePath);
}

const getPageEdit = (req, res) => {
    const id = parseInt(req.params.id);
    const { err, index } = task.existTask(id, 'edit');

    if ( err ) {
        res.redirect('/');
    } else {
        let filePath;

        if ( index === -1 ) {
            filePath = path.join(__dirname, '../public/pages/error.html');
        } else {
            filePath = path.join(__dirname, '../public/pages/edit.html');
        }

        res.setHeader('Content-type', 'text/html');
        res.sendFile(filePath);
    }
}

const getAllTasks = (req, res) => {
    res.setHeader('Content-type', 'text/json');
    res.status(200).send(task.Task.getAllList());
}

const getTask = ( req, res ) => {
    const id = parseInt(req.params.id);

    res.setHeader('Content-type', 'text/json');
    res.status(200).send(task.Task.getTask(id));
}

const addTask = (req, res) => {
    const title = req.body.title.trim();
    const description = req.body.description.trim();

    res.setHeader('Content-type', 'text/json');
    res.status(200).send(task.Task.add(title, description));
}

const editTask = (req, res) => {
    const id = parseInt(req.params.id);
    const title = req.body.title.trim();
    const description = req.body.description.trim();

    res.setHeader('Content-type', 'text/json');
    res.status(200).send(task.Task.edit(id, title, description));
}

const completedTask = (req, res) => {
    const id = parseInt(req.params.id);

    res.setHeader('Content-type', 'text/json');
    res.status(200).send(task.Task.completed(id));
}

const uncompletedTask = (req, res) => {
    const id = parseInt(req.params.id);

    res.setHeader('Content-type', 'text/json');
    res.status(200).send(task.Task.uncompleted(id));
}

const removeTask = (req, res) => {
    const id = parseInt(req.params.id);

    res.setHeader('Content-type', 'text/json');
    res.status(200).send(task.Task.remove(id));
}

export default {
    getPageIndex,
    getPageError,
    getPageEdit,
    getAllTasks,
    getTask,
    addTask,
    editTask,
    completedTask,
    uncompletedTask,
    removeTask
}