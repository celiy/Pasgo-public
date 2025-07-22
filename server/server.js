//Cria variaveis de ambiente importadas do .env e Cria variaveis de ambiente
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
//lib que interage com mongodb
const mongoose = require('mongoose');

//Handler de erros globais do código
process.on('uncaughtException', (err) => {
    console.log('\n'+ err.name + ': ' + err.message);
    console.log("UNCAUGHT EXCEPTION OCCURED! Shutting down...");
    process.exit(1);
});

const app = require('./app');

//ver variaveis de ambiente
console.log("Ambiente atual: "+process.env.NODE_ENV);

//conectar a database
console.log("Conectando ao banco de dados...");
mongoose.connect(process.env.CONN_STR).then((conn) => {
    //console.log(conn);
    console.log("Conectado ao banco de dados");

    //CRIAR SERVER
    const ip = '127.0.0.1';
    const port = process.env.PORT || 8000;
    const server = app.listen(port, ip, () => {
        console.log("Servidor iniciado "+ip+":"+port);
    });
});

process.on('unhandledRejection', (err) => {
    console.log(err + ':\n'+ err.name + ': ' + err.message);
    console.log("UNHANDLED REJECTION! Shutting down...");

    server.close(() => {
        process.exit(1);
    });
});