const mongoose = require('mongoose');
const validator = require('validator');
const CustomError = require('./../utils/CustomError');

//schema e model
//schema - template de item para ser inserido na database
const produtoSchema = new mongoose.Schema({
    codigo: {
        type: String,
    },
    tipo: {
        type: String,
        required: [true, "O produto precisa de um tipo"],
    },
    nome: {
        type: String,
        required: [true, "O produto precisa de um nome"],
        maxlength: [50, "O produto precisa ter menos de 50 caracteres"],
        minlength: [2, "O produto precisa ter mais de 1 caracteres"],
        trim: true,
    },
    marca: {
        type: String,
        maxlength: [50, "A marca precisa ter menos de 50 caracteres"],
    },
    modelo: {
        type: String,
        maxlength: [50, "O modelo precisa ter menos de 50 caracteres"],
    },
    peso: {
        type: String,
        maxlength: [20, "O peso precisa ter menos de 20 caracteres"],
    },
    localizacao: {
        type: String,
        maxlength: [50, "O local precisa ter menos de 50 caracteres"],
    },
    cor: {
        type: String,
        maxlength: [20, "A cor precisa ter menos de 20 caracteres"],
    },
    genero : {
        type: String,
        maxlength: [20, "O genero precisa ter menos de 20 caracteres"],
    },
    tamanho : {
        type: String,
        maxlength: [30, "O tamanho precisa ter menos de 30 caracteres"], 
    },
    quantidade : {
        type: Number,
        min: [0, 'A quantidade não pode ser negativa.'],
    },
    valor : {
        type: Number,
        min: [0, 'O valor não pode ser negativo.'],
        required: [true, 'O valor é obrigatório.'],
    },
    fornecedor : {id: String, nome: String},
    descricao : {
        type: String,
        maxlength: [200, "O descrição precisa ter menos de 200 caracteres"], 
    },
    criadoPor: {
        type: String,
        required: true,
        immutable: true
    }
});

produtoSchema.pre('save', function(next){
    // Só faz a checagem se for novo ou se o código/criadoPor mudou
    if (this.isNew || this.isModified('codigo') || this.isModified('criadoPor')) {
        Produto.findOne({
            codigo: this.codigo,
            criadoPor: this.criadoPor,
            _id: { $ne: this._id } // Ignora o próprio registro ao editar
        })
        .then(produto => {
            if (produto) {
                return next(new CustomError('Você já possui um produto com este código cadastrado.', 400));
            }
            next();
        })
        .catch(next);
    } else {
        next();
    }
});

//model do schema
const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;