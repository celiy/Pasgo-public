const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');

//schema e model
//schema - template de item para ser inserido na database
const servicoSchema = new mongoose.Schema({
    nome: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[\p{L}\s]+$/u.test(value);
            },
            message: 'O campo "nome" deve conter apenas letras e espaços.',
        },
        required: [true, "O serviço precisa de um nome"], //use este modelo para um item obrigatório
        maxlength: [50, "O serviço precisa ter menos de 50 caracteres"], //tamanho max da string
        minlength: [2, "O serviço precisa ter mais de 1 caracteres"], //tamanho min da string
        trim: true,
        required: [true, "O nome é obrigatório."],
    },
    custo: {
        type: Number,
        required: [true, "O custo é obrigatório."],
    },
    venda : {
        type: Number,
        required: [true, "O valor de venda é obrigatório."],
    },
    comissao : {
        type: Number,
    },
    descricao : {
        type: String,
        maxlength: [200, "A descrição precisa ter menos de 200 caracteres"],
    },
    criadoPor: {
        type: String,
        required: true,
        immutable: true
    }
});

//Triggers (middleware) do próprio Mongo quando um objeto vai ser salvo na DB
//post, save trigger depois de salvar na DB | (function(doc) <- recebe o documento criado)
servicoSchema.post('save', function(doc, next){
    next();
});

//model do schema
const Servico = mongoose.model('Servico', servicoSchema);

module.exports = Servico;