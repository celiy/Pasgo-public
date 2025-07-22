const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');
const Venda = require('./vendasModel');
const Conta = require('./contasModel');

//schema e model
//schema - template de item para ser inserido na database
const funcionarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[\p{L}\s]+$/u.test(value);
            },
            message: 'O campo "nome" deve conter apenas letras e espaços.',
        },
        required: [true, "O funcionário precisa de um nome"], //use este modelo para um item obrigatório
        maxlength: [50, "O funcionário precisa ter menos de 50 caracteres"], //tamanho max da string
        minlength: [2, "O funcionário precisa ter mais de 1 caracteres"], //tamanho min da string
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
    rg : {
        type: String,
        maxlength: [50, "O RG precisa ter menos de 50 caracteres"], 
    },
    salario : {
        type: Number,
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
funcionarioSchema.post('save', function(doc, next){
    next();
});

funcionarioSchema.pre('findOneAndUpdate', async function(next) {
    await Venda.updateMany({'funcionario.id': this._update.id, criadoPor: this._conditions.criadoPor}, 
        { $set: {'funcionario.nome': this._update.nome}});
    
    await Conta.updateMany({'entidade.id': this._update.id, criadoPor: this._conditions.criadoPor}, 
        { $set: {'entidade.nome': this._update.nome}});

    next();
});

//model do schema
const Funcionario = mongoose.model('Funcionario', funcionarioSchema);

module.exports = Funcionario;