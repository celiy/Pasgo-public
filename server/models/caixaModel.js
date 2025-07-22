const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');

//schema e model
//schema - template de item para ser inserido na database
const caixaSchema = new mongoose.Schema({
    produtos : [{codigo: String, nome: String, quantidade: Number, valor: Number}],
    pagamento: {
        type: String,
        maxlength: [42, "A forma de pagamento precisa ter menos de 42 caracteres"],
        required: [true, "A forma de pagamento é obrigatória"]
    },
    feitoEm: {
        type: Date,
    },
    criadoPor: {
        type: String,
        required: true,
        immutable: true
    }
});

//model do schema
const Caixa = mongoose.model('Caixa', caixaSchema);

module.exports = Caixa;