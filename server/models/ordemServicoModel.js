const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');
const CustomError = require('../utils/CustomError');

//schema e model
//schema - template de item para ser inserido na database
const ordemServicoSchema = new mongoose.Schema({
    cliente: {id: String, nome: String},
    status : {
        type: String,
        maxlength: [20, "O status precisa ter menos de 20 caracteres"],
        enum: {
            values: ["aberta", "cancelada", "andamento", "concluida"],
            message: "O status deve ser 'aberta', 'cancelada', 'andamento' ou 'concluida'."
        },
        required: [true, "O status é obrigatório."]
    },
    tipo : {
        type: String,
        maxlength: [20, "O tipo precisa ter menos de 20 caracteres"],
    },
    tipoServiço : {
        type: String,
        maxlength: [20, "O tipo de serviço precisa ter menos de 20 caracteres"],
    },
    servico : [{id: String, nome: String, quantidade: Number, venda: Number, total: Number}],
    funcionario : {id: String, nome: String},
    desconto : {
        type: Number,
    },
    valor: {
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
    dataEmissao : {
        type: Date,
        required: [true, "A data de emissão é obrigatória."]
    },
    dataExecucao : {
        type: Date,
        required: [true, "A data de execução é obrigatória."]
    },
    dataConclusao : {
        type: Date,
        required: [true, "A data de conclusão é obrigatória."]
    },
    dataPagamento : {
        type: Date,
        validate: {
            validator: function (value) {
                return value !== "Sim" || this.dataPagamento !== undefined;
            },
            message: "O campo 'Data de Pagamento' é obrigatório se 'Foi pago' estiver como 'Sim'."
        },
    },
    imagens : {
        type: [String],
        maxlength: [6, "O número máximo de imagens é 6"],
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
    materiaisEquipamentos : {
        type: String,
        validate: {
            validator: function (value) {
                if (value.length > 0) return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s,.]+$/.test(value);
            },
            message: 'O campo "Materiais e equipamentos" deve conter apenas ".", ",", letras, números e espaços.',
        },
        maxlength: [1000, "Os materiais precisa ter menos de 1000 caracteres."],
    },
    lista : {
        type: String,
        validate: {
            validator: function (value) {
                if (value.length > 0) return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s,.]+$/.test(value);
            },
            message: 'O campo "Lista" deve conter apenas ".", ",", letras, números e espaços.',
        },
        maxlength: [5000, "Os equipamentos precisa ter menos de 5000 caracteres."],
    },
    descricao : {
        type: String,
        validate: {
            validator: function (value) {
                return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+$/.test(value);
            },
            message: 'O campo "descrição" deve conter apenas letras, números e espaços.',
        },
        maxlength: [200, "A descrição precisa ter menos de 200 caracteres."], 
        minlength: [3, "A descrição precisa ter pelo menos 3 caracteres."]
    },
    criadoPor: {
        type: String,
        required: true,
        immutable: true
    }
});

ordemServicoSchema.pre('save', function(next){
    if (!this.cliente || !this.cliente.id) {
        return next(new CustomError("Selecione um cliente."));
    } 

    next();
});

const Ordem = mongoose.model('Ordem', ordemServicoSchema);

module.exports = Ordem;