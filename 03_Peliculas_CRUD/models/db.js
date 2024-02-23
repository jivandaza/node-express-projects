import mongoose from 'mongoose';

const mongo_uri = 'mongodb://localhost:27017/movies';

const connection = mongoose.connection;

export default class Connect {
    static connect (){
        mongoose.connect(mongo_uri)
        .then( () => {
            Connect.open();
        })
        .catch(() => {
            Connect.error();
        });
    }

    static open (){
        connection.once('open', () => {
            console.log('Conexión a la BD exitosa...');
        });
    }

    static error (){
        connection.once('error', (err) => {
            console.log('Error en la conexión a la BD: ' + err.message);
        });
    }

    static disconnected() {
        connection.on('disconnected', () => {
            console.log('La conexión a la BD fue cerrada...');
        });
    }

    static sigint() {
        process.on('SIGINT', () => {
            connection.close(() => {
                console.log('Aplicación terminada. Conexión a la BD cerrada.');
                process.exit(0);
            });
        });
    }
}