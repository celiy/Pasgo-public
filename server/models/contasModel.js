const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');
const CustomError = require('./../utils/CustomError');

//schema e model
//schema - template de item para ser inserido na database
const contaSchema = new mongoose.Schema({
    nome: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[\p{L}\s]+$/u.test(value);
            },
            message: 'O campo "nome" deve conter apenas letras e espaços.',
        },
        required: [true, "A conta precisa de um nome"], //use este modelo para um item obrigatório
        maxlength: [50, "A conta precisa ter menos de 50 caracteres"], //tamanho max da string
        minlength: [2, "A conta precisa ter mais de 1 caracteres"], //tamanho min da string
        trim: true,
        required: [true, "O nome é obrigatório."],
    },
    tipoEntidade: {
        type: String,
    },
    entidade : {id: String, nome: String},
    custo : {
        type: Number,
        required: [true, "O valor é obrigatório."],
    },
    juros : {
        type: Number,
    },
    desconto : {
        type: Number,
    },
    subtotal : {
        type: Number,
    },
    pagamento : {
        type: String,
        maxlength: [20, "pagamento tem que ter menos que 20 caracteres."],
    },
    quitado : {
        type: String,
        maxlength: [10, "Quitado tem que ter menos que 10 caracteres."],
        enum: {
            values: ["Sim", "Não"],
            message: "O status de Quitado deve ser Sim ou Não."
        },
        required: [true, "O status de quitado é obrigatório."],
    },
    vencimento : {
        type: Date,
    },
    descricao : {
        type: String,
        maxlength: [200, "A descrição precisa ter menos de 200 caracteres."],
    },
    criadoPor: {
        type: String,
        required: true,
        immutable: true
    }
});

contaSchema.pre('save', function(next){
    if (this.tipoEntidade !== "propria" && !this.entidade.nome) {
        next(new CustomError("Selecione uma entidade!"));
    } else {
        next();
    }
});

//model do schema
const Conta = mongoose.model('Conta', contaSchema);

module.exports = Conta;