//classe que quando criada um objeto, usa o handling de erros globais do app.js
class CustomError extends Error {
    constructor(message, statusCode){
        super(message); //super chama o construtor da classe pai Error
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;