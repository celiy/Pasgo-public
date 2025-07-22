const mongoose = require('mongoose');
const validator = require('validator');
//lib para incripitação (hashing)
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

//schema e model
//schema - template de item para ser inserido na database

//schema: template de usuario
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[A-Za-z\s]+$/.test(value);
            },
            message: 'O campo "nome" deve conter apenas letras e espaços.',
        },
        required: [true, 'Por favor insira um nome.']
    },
    email: {
        type: String,
        required: [true, 'Por favor insira um email.'],
        unique: [true, 'Este email já está cadastrado.'],
        lowercase: true, //não é um validor, ele converte para lowercase
        validate: [validator.isEmail, 'Por favor insira um email valido.']
    },
    document: {
        type: String,
        required: [true, 'Por favor insira um CPF/CNPJ.'],
        unique: [true, 'Este CPF/CNPJ já está cadastrado.'],
        validate: [validator.isNumeric, 'Por favor insira um CPF/CNPJ valido.'],
        minlength: [11, 'O CPF/CNPJ deve ter pelo menos 11 caracteres.'],
        maxlength: [14, 'O CPF/CNPJ deve ter no máximo 14 caracteres.'],
    },
    role: {
        type: String,
        enum: ['user'], //este campo faz com que quando este campo for preenchido, ele só pode ser preenchido
        default: 'user' //com o valores dentro do enum
    },
    contaStats: {
        lastModified: Date, 
        current: Date,
        stats: Object,
    },
    contasStatsDashboard: {
        lastModified: Date, 
        current: Date, 
        stats: Object,
    },
    vendaStats: {
        lastModified: Date, 
        current: Date, 
        stats: Object,
    },
    vendaStatsDashboardFinal: {
        lastModified: Date, 
        current: Date, 
        stats: Object,
    },
    caixaStats: {
        lastModified: Date, 
        current: Date, 
        stats: Object,
    },
    clientes: {
        type: Number,
        default: 0,
    },
    fornecedores: {
        type: Number,
        default: 0,
    },
    funcionarios: {
        type: Number,
        default: 0,
    },
    produtos: {
        type: Number,
        default: 0,
    },
    servicos: {
        type: Number,
        default: 0,
    },
    ordens: {
        type: Number,
        default: 0,
    },
    vendas: {
        type: Number,
        default: 0,
    },
    caixas: {
        type: Number,
        default: 0,
    },
    contas: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        required: [true, 'Por favor insira uma senha.'],
        minlength: [8, 'A senha precisa ter pelo menos 8 caracteres.'],
        select: false //evita que este campo seja mostrado quando usado o find()
    },
    confirmPassword: {
        type: String,
        required: [true, 'Por favor confirme sua senha.'],
        validate: {
            //esse validator só funciona para save() e create()
            validator: function(value) {
                if (process.env.CREATE_MOCK === "true") return true;

                return value === this.password;
            },
            message: 'As senhas não conferem.'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,

    newDeviceToken: String,
    authorizedIPs: [{ip: String, lastAcess: Date}],

    toBeDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    
    lastLogin: {
        type: Date,
        default: null
    },
    lastLoginAlert: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        immutable: true
    }
});

//encripita a password
userSchema.pre('save', async function(next){
    if(!this.isModified('password') || process.env.CREATE_MOCK === "true") return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

//Cria uma função que pode ser usado por um objeto criado a partir de um item da DB
//Ex: const var_user = User...
//var_user.comparePasswordInDB(args)
//esta função compara se a senha insirida pelo o usuario para login é igual a senha encripitada na DB
userSchema.methods.comparePasswordInDB = async function(userPassword, passwordInDB){
    return await bcrypt.compare(userPassword, passwordInDB);
}

//esta função converte a data que o token foi pego e a data que a senha foi mudada em numeros inteiros em MS
//e compara se a senha foi mudada antes ou depois do token ser gerado
userSchema.methods.isPasswordChanged = async function(JWTTimestamp) {
    if(this.passwordChangedAt){
        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < passwordChangedTimestamp;
    }
    return false;
}

//esta função cria um token para o usuário que está tentando mudar a sua senha, então este token
//é gerado e adicionado a sua conta e enviado por email, que é um link que o path é o token
userSchema.methods.createResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

//model do schema
const User = mongoose.model('User', userSchema);

module.exports = User;