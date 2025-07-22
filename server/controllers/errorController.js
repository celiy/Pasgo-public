//Funções para handling de erros
const CustomError = require("./../utils/CustomError");
const authLogger = require('./../utils/authLogger');
const errorLogger = require('./../utils/errorLogger');
const moment = require('moment');

const logAuth = (request, type) => {
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const currentDate = moment(new Date()).format('DD/MM/YYYY | HH:mm:ss');
    authLogger.auth(`[${currentDate}] ${request.method} ${request.url} | ${type} | ${ip}`);
}

const logError = (request, error) => {
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const currentDate = moment(new Date()).format('DD/MM/YYYY | HH:mm:ss');
    errorLogger.error(`[${currentDate}] ${request.method} ${request.url} | ${error.message} | stackTrace: ${error.stack} | ${ip}`);
}

const devErrors = (response, error) => {
    response.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const castErrorHandler = (err) => {
    const msg = 'Valor inválido para: ' + err.path + ' , Valor enviado: ' + err.value;
    return new CustomError(msg, 400);
}

const duplicateKeyErrorHandler = (err) => {
    if(err.keyValue.name){
        const msg = 'Item duplicado: ' + err.keyValue.name;
        return new CustomError(msg, 400);
    } if (err.keyValue.email){
        const msg = 'Item duplicado: ' + err.keyValue.email;
        return new CustomError(msg, 400);
    }
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(value => value.message);
    const errorMessages = errors.join('. ');
    const msg = 'Informação inválida: ' + errorMessages;
    return new CustomError(msg, 400);
}

const tokenExpiredHandler = (err) => {
    return new CustomError('Seu login expirou. Por favor, faça login novamente.', 401);
}

const tokenErrorHandler = (err) => {
    return new CustomError('Credenciais inválidas. Por favor, faça login novamente.', 401);
}

const prodErrors = (response, error) => {
    if (error.isOperational){
        response.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    } else {
        response.status(500).json({
            status: 'error',
            message: 'Aconteceu algo de errado.'
        });
    }
}

//Handling global de erros
module.exports = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500; //error.statusCode recebe o codigo de erro ou 500(erro internal do server)
    error.status = error.status || 'error';
    logError(request, error);

    //handling de erros mais avançados com informações sensiveis apenas visivel se var de ambiente for development
    if (process.env.NODE_ENV === 'development') {
        devErrors(response, error);
    }

    //handling de erros na versão de produção (acesso publico)
    //o objeto error pode receber erros da DB, que no caso são os exemplos abaixo
    else if(process.env.NODE_ENV === 'production') {
        if (error.name == 'CastError'){      //erro caso algo tipo ID enviado do usuário não bata com o tipo de campo na DB
            error = castErrorHandler(error);//Ex: um ID de 123 é inválido pq 123 n é um tipo de ID válido que o Mongo usa
        }
        if (error.code === 11000){ //handler de key na db duplicado
            error = duplicateKeyErrorHandler(error);
        }
        if (error.name === 'ValidationError') { //handler de erros de validação da DB
            error = validationErrorHandler(error);
        }
        if (error.name === 'TokenExpiredError') { //handler de error de token expirado
            logAuth(request, "Token expired");

            error = tokenExpiredHandler(error);
        }
        if (error.name === 'JsonWebTokenError') { //handler de error de token inválido
            logAuth(request, "Token error");

            error = tokenErrorHandler(error);
        }

        prodErrors(response, error);
    }
}