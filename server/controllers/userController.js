const User = require('./../models/userModel');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/CustomError');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utils/email');

const filterReqObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(prop => {
        if(allowedFields.includes(prop)){
            newObj[prop] = obj[prop];
        }
    })
    return newObj;
}

//cria um token para login que expira em 30 dias e mantém no sistema como um usuário logado
const signtoken = (user_id) => {
    return jwt.sign({id: user_id}, process.env.SECRET_STRING, {
        expiresIn: process.env.LOGIN_EXPIRES
    });
}

exports.updatePassword = asyncErrorHandler(async (request, response, next) => {
    const user = await User.findById(request.user._id).select('+password');

    if (!(await user.comparePasswordInDB(request.body.currentPassword, user.password))){
        return next(new CustomError('A senha enviada está errada.', 401));
    }

    user.password = request.body.password;
    user.confirmPassword = request.body.confirmPassword;
    await user.save();

    const token = signtoken(user._id);

    response.status(200).json({
        status: 'sucess',
    })
})

exports.updateMe = asyncErrorHandler(async (request, response, next) => {
    if (request.body.password || request.body.confirmPassword){
        return next(new CustomError('Você não pode atualizar sua senha neste endereço.', 400));
    }  

    await User.findByIdAndUpdate(request.user._id, {name: request.body.name}, {new: true, runValidators: true});
    
    response.status(200).json({
        status: 'success'
    })
})

exports.getUser = asyncErrorHandler(async (request, response, next) => {
    
    response.status(200).json({
        status: 'success',
        data: request.user
    })
})

exports.support = asyncErrorHandler(async (request, response, next) => {
    if (request.body.message.length > 1000){
        return next(new CustomError('A mensagem deve ter menos de 1000 caracteres.', 400));
    }
    if (request.body.message.length < 10){
        return next(new CustomError('A mensagem deve ter mais de 10 caracteres.', 400));
    }
    const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s\.,\?]+$/;
    if(!regex.test(request.body.message)){
        return next(new CustomError('A mensagem deve conter apenas letras, números, espaços e caracteres especiais comuns.', 400));
    }

    const message = request.body.message;
    const type = request.body.type;

    if (type === "feedback") {
        const score = request.body.score ?? 0;

        await sendEmail({
            email: 'sasbrazilian@gmail.com',
            subject: 'FeedBack, nota: '+score,
            message: "Enviado por: "+request.user.email+"\n\nMensagem: "+message,
        });
    } else {
        await sendEmail({
            email: 'sasbrazilian@gmail.com',
            subject: 'Suporte, '+type,
            message: "Enviado por: "+request.user.email+"\n\nMensagem: "+message,
        });
    }

    response.status(200).json({
        status: 'success',
    })
})

exports.scheduleDelete = asyncErrorHandler(async (request, response, next) => {
    const password = request.body.password;

    if (!password) {
        const error = new CustomError('Você precisa inserir a sua senha para deletar a sua conta.', 400);
        return next(error);
    }

    const user = await User.findById(request.user._id).select('+password');

    if (!user) {
        const error = new CustomError('Usuário não encontrado.', 404);
        return next(error);
    }

    if (!(await user.comparePasswordInDB(password, user.password))){
        const error = new CustomError('A senha enviada está errada.', 401);
        return next(error);
    }
    
    await User.findByIdAndUpdate(request.user._id, {toBeDeleted: true, deletedAt: Date.now()});
    
    response.status(200).json({
        status: 'success',
    })
})

exports.revertAccountDeletion = asyncErrorHandler(async (request, response, next) => {
    const password = request.body.password;
    const email = request.body.email;

    if (!password || !email) {
        const error = new CustomError('Você precisa inserir a sua senha e email para reverter a deleção da sua conta.', 400);
        return next(error);
    }

    const user = await User.findOne({email: email}).select('+password');

    if (!user) {
        const error = new CustomError('Usuário não encontrado.', 404);
        return next(error);
    }

    if (user.toBeDeleted === false) {
        const error = new CustomError('A conta não está marcada para ser deletada.', 400);
        return next(error);
    }

    if (!(await user.comparePasswordInDB(password, user.password))){
        const error = new CustomError('A senha enviada está errada.', 401);
        return next(error);
    }

    await User.findByIdAndUpdate(user._id, {toBeDeleted: false, deletedAt: null});

    response.status(200).json({
        status: 'success',
    })
})