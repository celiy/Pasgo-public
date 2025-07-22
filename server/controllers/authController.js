const User = require('./../models/userModel');
const Generic = require('./../models/genericModel');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/CustomError');
const jwt = require('jsonwebtoken');
const jsUtils = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const moment = require('moment');
const axios = require('axios');
const authLogger = require('./../utils/authLogger');
const { validateCPF, validateCNPJ } = require('./../utils/validators');

const logAuth = (request, type) => {
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const currentDate = moment(new Date()).format('DD/MM/YYYY | HH:mm:ss');
    authLogger.auth(`[${currentDate}] ${request.method} ${request.url} | ${type} | ${ip}`);
}

const options = {
    maxAge: process.env.LOGIN_EXPIRES,
    httpOnly: true,

    //* temporariamente falso enquanto n tem tls
    secure: false,
}

//cria um token para login que expira em 30 dias e mantém no sistema como um usuário logado
const signtoken = (user_id) => {
    return jwt.sign({id: user_id}, process.env.SECRET_STRING, {
        expiresIn: process.env.LOGIN_EXPIRES
    });
}

const createSendResponse = (user, statusCode, response) => {
    const filteredUser = {
        name: user.name,
        email: user.email
    };

    //esta parte é a reposta quando um usuário cria uma conta, loga, muda de senha...
    //e manda o token de verificação para login em um cookie.
    const token = signtoken(user._id);
    if (process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    response.cookie('jwt', token, options);

    response.status(statusCode).json({
        status: 'success',
        data: {
            user: filteredUser
        }
    });
}

//Criação de usuario
const createUser = async(user, response, next) => {
    const emailConfirmation = await Generic.findOne({ userEmail: user.email });

    if (emailConfirmation && (emailConfirmation.registerEmailCode === user.emailCode) && (emailConfirmation.userEmail === user.email) && (user.type === "register")) {
        if (emailConfirmation.requestedAt < moment().subtract(10, 'minutes').toDate()) {
            await Generic.findByIdAndDelete(emailConfirmation._id);
            return next(new CustomError('O código de verificação expirou.', 400));
        } else {
            await Generic.findByIdAndDelete(emailConfirmation._id);

            user.lastLogin = new Date();
            const newUser = await User.create(user);

            createSendResponse(newUser, 201, response);
        }
    } else if (emailConfirmation && (emailConfirmation.registerEmailCode !== user.emailCode) && (emailConfirmation.userEmail === user.email) && (user.type === "register")) {
        if (emailConfirmation.requestedAt < moment().subtract(10, 'minutes').toDate()) {
            await Generic.findByIdAndDelete(emailConfirmation._id);
            return next(new CustomError('EXPIRED', 400));
        } else {
            return next(new CustomError('INVALID_CODE', 400));
        }
    } else {
        // Se já existe uma confirmação de email pendente e o usuário não informou o emailCode, deletar confirmação pendente
        const existingUser = await Generic.findOne({ userEmail: user.email });

        if (existingUser) {
            await Generic.findByIdAndDelete(existingUser._id);
        }

        const emailToken = crypto.createHash('sha256').update(user.email).digest('hex');

        const sixCharToken = Array(6).fill(0).map(() => {
            const randomIndex = Math.floor(Math.random() * emailToken.length);
            return emailToken[randomIndex];
        }).join('');

        await Generic.create({userEmail: user.email, registerEmailCode: sixCharToken, requestedAt: new Date()});

        const message = `Use o codigo a seguir para verificar seu email:\n\n${sixCharToken}\n\nNão compartilhe este código com ninguém. Este código será válido por apenas 10 minutos.`
        
        try{
            await sendEmail({
                email: user.email,
                subject: 'Código de acesso.',
                message: message
            });
    
            response.status(200).json({
                status:'success',
                message:'Código de acesso enviado.',
                type: 'codeSent'
            })
        }
        catch (err) {
            return next(new CustomError('Ocorreu um erro ao enviar o email de verificação de conta.', 500));
        }
    }
}

exports.signup = asyncErrorHandler (async (request, response, next) => {
    if (!request.body.name || !request.body.email || !request.body.password || !request.body.confirmPassword || !request.body.document) {
        const error = new CustomError('Por favor insira todos os campos.', 400);
        return next(error);
    }

    const userDocument = request.body.document.replace(/\D/g, '');

    let documentIsValid = false;

    if (userDocument.length === 11) {
        if (!validateCPF(userDocument)) {
            const error = new CustomError('Por favor insira um CPF válido.', 400);
            return next(error);
        }

        documentIsValid = true;
    }

    if (userDocument.length === 14) {
        if (!validateCNPJ(userDocument)) {
            const error = new CustomError('Por favor insira um CNPJ válido.', 400);
            return next(error);
        }

        documentIsValid = true;
    }

    if (!documentIsValid) {
        const error = new CustomError('Por favor insira um CPF/CNPJ válido.', 400);
        return next(error);
    }

    const filteredUserCreation = {
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        emailCode: request.body.emailCode,
        document: userDocument,
        type: request.body.type
    }

    await createUser(filteredUserCreation, response, next);
});

exports.login = asyncErrorHandler (async (request, response, next) => {
    const email = request.body.email;
    const password = request.body.password;
    const acceptedTerms = request.body.confirmTerms;

    if (!email || !password) {
        const error = new CustomError('Por favor insira um email e uma senha.', 400);
        return next(error);
    }

    const user = await User.findOne({email: email}).select("+password");

    //Articialmente esperar um tanto de segundos antes de efetuar login para evitar time attacks
    if (!user) {
        const waitTime = Math.floor(Math.random() * (6000 - 3000 + 1)) + 4000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        const error = new CustomError('Email ou senha incorretos.', 400);
        return next(error);
    }

    if (user.toBeDeleted) {
        const error = new CustomError('ACCOUNT_DELETED', 400);
        return next(error);
    }

    if (user.lastLogin) {
        if (moment().isAfter(moment(user.lastLogin).add(1, 'year')) && !acceptedTerms) {
            const error = new CustomError('ACCOUNT_INACTIVE', 400);
            return next(error);
        }
    }

    if (user && process.env.CREATE_MOCK === "true") {
        user.lastLogin = new Date();
        await User.findByIdAndUpdate(user._id, user, { new: true, runValidators: true });

        return createSendResponse(user, 200, response);
    }
    
    if (!user || !(await user.comparePasswordInDB(password, user.password))) {
        const error = new CustomError('Email ou senha incorretos.', 400);
        return next(error);
    }

    // Não está funcionando, tentar resolver
    // Pega endereço de IP do usuário
    // const ip = request.headers['x-forwarded-for'] ?? request.socket.remoteAddress;

    // if (user.authorizedIPs.length > 0) {
    //     const ipArray = user.authorizedIPs;
    //     let valid = false;

    //     // Verifica se o IP do usuário já foi utilizado antes
    //     for (let n=0;n<ipArray.length;n++){
    //         if (ipArray[n].ip === ip){
    //             valid = true;
    //             ipArray[n].lastAcess = new Date();
    //         }
            
    //         // Se algum IP estar inativo (ultima vez usado a 6 meses) remover da lisa de IPs autorizados
    //         if (((new Date().getTime() - ipArray[n].lastAcess.getTime()) / (1000 * 60 * 60 * 24 * 30 * 6) > 1)
    //             && ipArray[n].ip !== ip){
    //             ipArray.splice(n, 1);
    //         }
    //     }

    //     if (!valid){
    //         const ipToken = crypto.createHash('sha256').update(ip).digest('hex');
    //         await User.findByIdAndUpdate(user._id, {newDeviceToken: ipToken});

    //         let siteUrl = "localhost:5173";

    //         if (process.env.NODE_ENV === "production") siteUrl = process.env.SITE_URL;
            
    //         const resetUrl = `${siteUrl}/accept-new-device/${ipToken}`;
    //         const message = `Uma requisição para aceitar um novo dispositivo foi feito \n\n pelo endereço de IP: ${ip}. Se este é você, clique no link: \n\n ${resetUrl}\n\n -Suporte Pasgo`

    //         await sendEmail({
    //             email: user.email,
    //             subject: 'Autorizar novo dispositivo.',
    //             message: message
    //         });

    //         const error = new CustomError('Você está tentando acessar sua conta por outro dispositivo. Para acessar ela por este novo dispositivo, enviamos no seu email um link para autorizar este novo dispositivo.', 400);
    //         return next(error);
    //     } else {
    //         await User.findByIdAndUpdate(user._id, {authorizedIPs: ipArray});
    //     }
    // } else {
    //     const ipArray = user.authorizedIPs;
    //     const ip = request.ip;

    //     ipArray.push({ip: ip, lastAcess: new Date()});

    //     await User.findByIdAndUpdate(user._id, { $set: { authorizedIPs: ipArray } });
    // }

    user.lastLogin = new Date();
    user.lastLoginAlert = false;
    await User.findByIdAndUpdate(user._id, user, { new: true, runValidators: true });

    createSendResponse(user, 200, response);
});

//! TODO: Resolver 
// Ligada a função login para autoriza IP novo
exports.acceptDevice = asyncErrorHandler (async (request, response, next) => {
    return response.status(statusCode).json({
        status: 'success',
        data: {
            user: filteredUser
        }
    }); 

    const requestIP = request.headers['x-forwarded-for'] ?? request.socket.remoteAddress;
    const ipToken = request.body.ipToken;

    let user = await User.findOne({ newDeviceToken: ipToken });

    if (!user) {
        return next(new CustomError('Um erro aconteceu na autorização de dispositivo.', 400));
    }

    const ipArray = user.authorizedIPs;
    ipArray.push({ip: requestIP, lastAcess: new Date()})

    user = await User.findByIdAndUpdate(user._id, {authorizedIPs: ipArray, newDeviceToken: 'none' });

    user.lastLogin = new Date();
    await user.save();

    createSendResponse(user, 200, response);
});

exports.updateMe = asyncErrorHandler(async (request, response, next) => {
    if (request.body.password || request.body.confirmPassword){
        return next(new CustomError('Você não pode atualizar sua senha neste endereço.', 400));
    }  

    const filteredObj = { name: request.body.name };
    const updatedUser = await User.findByIdAndUpdate(request.user._id, filteredObj);
    
    response.status(200).json({
        status: 'success'
    })
})

//função de logout que retorna o cookie de login como um cookie vazio
exports.logout = asyncErrorHandler (async (request, response, next) => {
    if (process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    response.cookie('jwt', '', options);

    response.status(200).json({
        status: 'success',
    });
});

//Controle que verifica se o token do usuario existe e se ele está logado antes
//dele poder fazer um get/post etc.
//Basicamente ele pega os valores passados pelo header de uma request.
//de preferencia, o header deve ter o seguinte campo:
//Key = Authorization | Value = bearer {userToken}
//OU na aba Authorization, Auth Type = Bearer Token e token = {{jwt}}
exports.protect = asyncErrorHandler (async (request, response, next) => {
    //Ver se token existe
    const token = request.cookies.jwt;

    //Salvar um log de erro caso o token não exista
    if(!token) {
        logAuth(request, "Not logged in");

        const error = new CustomError('Você precisa estar logado para esta ação.', 401);
        return next(error);
    }

    //Validar token
    //usa verify do jwt para verificar se o token enviado do usuário é valido.
    //se for, então este middleware será completado.
    const decodedToken = jwt.verify(token, process.env.SECRET_STRING);

    //como o token é criado com o ID do usuario, ao atribuir o token decodado a um objeto
    //esse ID decodado a partir do token pode ser usado para achar um usuario na DB
    const user = await User.findById(decodedToken.id);

    if(!user) {
        //Salvar um log de erro caso o token não exista
        logAuth(request, "Token not found");

        const error = new CustomError('Usuário com este token não encontrado.', 401);
        return next(error);
    }

    if (user.toBeDeleted) {
        const error = new CustomError('A conta está marcada para ser deletada. Então não pode ser acessada. Para reverter a deleção, clique em "Ajuda" na página principal e depois em "Reverter exclusão da conta".', 400);
        return next(error);
    }

    if(await user.isPasswordChanged(decodedToken.iat)) {
        //Salvar um log de erro caso a senha do usuário tenha sido alterada
        logAuth(request, "User changed password");

        const error = new CustomError('Usuário mudou a senha. Por favor, faca login novamente.', 401);
        return next(error);
    }
    
    //atribui o objeto user para um parametro da request para ser usado no proximo middleware (restrict)
    request.user = user;
    next();
});

exports.checkLogin = asyncErrorHandler (async (request, response, next) => {
    createSendResponse(request.user, 200, response);
});

//quando este controller for passado para uma route, ele pode receber um parametro authController.restrict('admin')
//este controller serve para pegar o objeto do user para chegar se o seu role bate com o parametro dado.
exports.restrict = (role) => {
    return (request, response, next) => {
        if (request.user.role !== role){
            logAuth(request, `${request.user._id} was denied access`);

            const error = new CustomError('Acesso negado.', 403);
            return next(error);
        }
        next();
    };
};
//exemplo caso uma array é passada | authController.restrict('admin', 'user')
//exports.restrict = (...role) => {
//if (!role.includes(request.user.role)){

exports.forgotPassword = asyncErrorHandler (async (request, response, next) => {
    //1. pegar usario baseado no email
    const user = await User.findOne({email: request.body.email});
    if (!user){
        const error = new CustomError('Usuário com este email não encontrado.', 404);
        return next(error);
    }
    //2. gerar token de reset
    const resetToken = user.createResetPasswordToken();

    await user.save({validateBeforeSave: false});

    //3. mandar token de volta
    let siteUrl = "localhost:5173";

    if (process.env.NODE_ENV === "production") siteUrl = process.env.SITE_URL;

    const resetUrl = `${siteUrl}/reset-password/${resetToken}`;
    const message = `Recebemos sua requisição de mudar a senha. Por favor use o link abaixo para mudar sua senha.\n\n${resetUrl}\n\nEste link será valido por apenas 10 minutos.`
    
    try{
        await sendEmail({
            email: user.email,
            subject: 'Requisição de mudar a senha recebida.',
            message: message
        });

        response.status(200).json({
            status:'success',
            message:'Link para mudança de senha enviada para o email do usuário.'
        })
    } catch (err){
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save({validateBeforeSave: false});

        return next(new CustomError('Aconteceu um erro ao tentar mudar a senha. Tente novamente mais tarde', 500));
    }
});

exports.resetPassword = asyncErrorHandler (async(request, response, next) => {
    const token = crypto.createHash('sha256').update(request.params.token).digest('hex')
    const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}})
    
    if (!user){
        const error = new CustomError('O usuário requisitado não existe ou o tempo de troca de senha expirou. Por favor, tente novamente.', 400);
        return next(error);
    }
    user.password = request.body.password;
    user.confirmPassword = request.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    user.lastLogin = new Date();
    await user.save();

    createSendResponse(user, 200, response);
});

exports.verifyCaptcha = asyncErrorHandler (async(request, response, next) => {
    const { data } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SITE_SECRET}&response=${request.body.captchaToken}`,)

    if (!data.success){
        logAuth(request, "Invalid captcha");

        const error = new CustomError('Captcha inválido.', 400);
        return next(error);
    }

    response.status(200).json({
        status: 'success'
    })
});