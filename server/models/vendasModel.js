const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');
const CustomError = require('./../utils/CustomError');

//schema e model
//schema - template de item para ser inserido na database
const vendaSchema = new mongoose.Schema({
    cliente: {id: String, nome: String},
    tipo : {
        type: String,
        maxlength: [20, "O tipo precisa ter menos de 20 caracteres"],
    },
    produto : [{id: String, nome: String, quantidade: Number, valor: Number, total: Number}],
    servico : [{id: String, nome: String, quantidade: Number, venda: Number, total: Number}],
    funcionario : {id: String, nome: String},
    valor : {
        type: Number,
    },
    desconto : {
        type: Number,
    },
    subtotal : {
        type: Number,
    },
    tipoPagamento : {
        type: String,
    },
    foiPago : {
        type: String,
        enum: {
            values: ["Sim", "Não"],
            message: "O status de Foi pago deve ser Sim ou Não."
        },
        required: [true, "O status de Foi pago é obrigatório."]
    },
    dataPagamento : {
        type: Date,
    },
    entregadora : {
        type: String,
        maxlength: [20, "A entregadora precisa ter menos de 20 caracteres"], 
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
    listaDigitada : {
        type: String,
        maxlength: [1000, "A lista precisa ter menos de 1000 caracteres"]
    },
    descricao : {
        type: String,
        validate: {
            validator: function (value) {
                return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+$/.test(value);
            },
            message: 'O campo "descrição" deve conter apenas letras, números e espaços.',
        },
        maxlength: [200, "A descrição precisa ter menos de 200 caracteres"], 
        minlength: [3, "A descrição precisa ter pelo menos 3 caracteres."]
    },
    criadoPor: {
        type: String,
        required: true,
        immutable: true
    },
});

//Triggers (middleware) do próprio Mongo quando um objeto vai ser salvo na DB
//post, save trigger depois de salvar na DB | (function(doc) <- recebe o documento criado)
vendaSchema.pre('save', function(next){
    if (!this.cliente || !this.cliente.id) {
        return next(new CustomError("Selecione um cliente."));
    } 

    try {
        if (this.produto.length < 1 && this.servico.length < 1 && this.listaDigitada.length < 2){
            return next(new CustomError("Selecione pelo menos um serviço, produto ou lista digitada."));
        }
    } catch(err) {
        return next(new CustomError("Selecione pelo menos um serviço, produto ou lista digitada."));
    }
        
    next();
});

//model do schema
const Venda = mongoose.model('Venda', vendaSchema);

module.exports = Venda;