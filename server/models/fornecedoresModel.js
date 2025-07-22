const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');

//schema e model
//schema - template de item para ser inserido na database
const fornecedorSchema = new mongoose.Schema({
    tipo: {
        type: String, //tipo dentro de [] indica que os values são dentro de uma array
        required: [true, "O fornecedor tem que ser uma pessoa física ou jurídica."],
    },
    nome: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[\p{L}\s]+$/u.test(value);
            },
            message: 'O campo "nome" deve conter apenas letras e espaços.',
        },
        required: [true, "O fornecedor precisa de um nome"], //use este modelo para um item obrigatório
        maxlength: [50, "O fornecedor precisa ter menos de 50 caracteres"], //tamanho max da string
        minlength: [2, "O fornecedor precisa ter mais de 1 caracteres"], //tamanho min da string
        trim: true,
    },
    email: {
        type: String,
    },
    cel : {
        type: String,
        maxlength: [20, "O número precisa ter menos de 20 caracteres"],
    },
    cpf : {
        type: String,
        maxlength: [11, "O CPF precisa ter menos de 11 caracteres"], 
    },
    cnpj : {
        type: String,
        maxlength: [14, "O CNPJ precisa ter menos de 14 caracteres"],
    },
    razaosocial : {
        type: String,
    },
    responsavel : {
        type: String,
    },
    rg : {
        type: String,
        maxlength: [50, "O RG precisa ter menos de 50 caracteres"], 
    },
    cep : {
        type: String,
        maxlength: [8, "O CEP precisa ter menos de 8 caracteres"], 
    },
    numero : {
        type: String,
        maxlength: [10, "O número precisa ter menos de 10 caracteres"], 
    },
    complemento : {
        type: String,
        maxlength: [50, "O complemento precisa ter menos de 50 caracteres"], 
    },
    bairro : {
        type: String,
        maxlength: [50, "O bairro precisa ter menos de 50 caracteres"], 
    },
    cidade : {
        type: String,
        maxlength: [50, "A cidade/UF precisa ter menos de 50 caracteres"], 
    },
    observacao: {
        type: String,
        maxlength: [500, "A observação precisa ter menos de 500 caracteres"], 
        trim: true
    },
    criadoPor: {
        type: String,
        required: true,
        immutable: true
    }
});

//Triggers (middleware) do próprio Mongo quando um objeto vai ser salvo na DB
//post, save trigger depois de salvar na DB | (function(doc) <- recebe o documento criado)
fornecedorSchema.post('save', function(doc, next){
    next();
});

//model do schema
const Fornecedor = mongoose.model('Fornecedor', fornecedorSchema);

module.exports = Fornecedor;