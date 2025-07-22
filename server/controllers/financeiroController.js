const mongoose = require('mongoose');
//objeto do schema e model para inserir itens da database
const Conta = require('./../models/contasModel');
const User = require('./../models/userModel');
//Features reusaveis
const ApiFeatures = require('./../utils/ApiFeatures');
//Middleware para router ('/highest-rated') que retorna os filmes com maior ratings
//Ele só modifica o query antes do getAllMovies

const CustomError = require('./../utils/CustomError');

//Função que quando dada uma função de um controller, pega o erro da função, sem o uso de try catch dentro
//para usar o handling de erros globais
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const moment = require('moment');
moment.locale('pt-br');

exports.getContasStats = asyncErrorHandler(async (request, response, next) => {
    if (request.user.contas > 0) {
        if ((request.user.contaStats.current && request.user.contaStats.lastModified &&
            moment(request.user.contaStats.lastModified).isBefore(moment(request.user.contaStats.current).subtract(1, 'hours'), 'second'))
            || !request.user.contaStats.stats) {
            
            const firstDayOfMonth = moment().subtract(6, 'months').startOf('month').toDate();
            const lastDayOfMonth = moment().endOf('month').toDate();

            const stats = await Conta.find({ criadoPor: request.user._id, vencimento: {$gte: firstDayOfMonth, $lte: lastDayOfMonth} }, 
                { subtotal: 1, quitado: 1, vencimento: 1, tipoEntidade: 1 }).limit(200);

            let contaStats = {
                vencidos: 0,
                vencemHoje: 0,
                aVencer: 0,
                pago: 0,
            };

            const hoje = moment();

            stats.forEach(conta => {
                if (conta.vencimento && conta.tipoEntidade !== "propria") {
                    const dataPag = moment(conta.vencimento);
                    //Vencidos
                    if (dataPag.isBefore(hoje, 'day') && conta.quitado === "Não") {
                        contaStats.vencidos = parseFloat((contaStats.vencidos + conta.subtotal).toFixed(2))
                    } //Vence hoje
                    else if (dataPag.isSame(hoje, 'day') && conta.quitado === "Não") {
                        contaStats.vencemHoje = parseFloat((contaStats.vencemHoje + conta.subtotal).toFixed(2))
                    } //A vencer
                    else if (dataPag.isAfter(hoje, 'day') && conta.quitado === "Não") {
                        contaStats.aVencer = parseFloat((contaStats.aVencer + conta.subtotal).toFixed(2))
                    } //Pago
                    else if (conta.quitado === "Sim") {
                        contaStats.pago = parseFloat((contaStats.pago + conta.subtotal).toFixed(2))
                    }
                }
            });

            const userStats = {
                lastModified: Date.now(),
                current: Date.now(),
                stats: contaStats
            }
            request.user.contaStats = userStats;
            await User.findByIdAndUpdate(request.user._id, request.user, { new: true, runValidators: true });

            response.status(200).json({
                status: 'success',
                data: {
                    contaStats
                }
            });
        } else {
            const contaStats = request.user.contaStats.stats;
            response.status(200).json({
                status: 'success',
                data: {
                    contaStats
                }
            });
        }

    } else {
        response.status(200).json({
            status: 'success',
            count: 0,
            data: [{}]
        });
    }
});

exports.getContasStatsDashboard = asyncErrorHandler(async (request, response, next) => {
    if (request.user.contas > 0 && request.user.contasStatsDashboard?.stats) {
        response.status(200).json({
            status: 'success',
            data: {
                contaStatsDashboard: request.user.contasStatsDashboard.stats
            }
        });
    } else {
        response.status(200).json({
            status: 'success',
            count: 0,
            data: [{}]
        });
    }
});

exports.getContas = asyncErrorHandler(async (request, response, next) => {
    if (request.user.contas > 0) {
        const features = new ApiFeatures(Conta.find({ criadoPor: request.user._id }), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const contas = await features.query;

        response.status(200).json({
            status: 'success',
            count: request.user.contas,
            data: {
                contas
            }
        });
    } else {
        response.status(200).json({
            status: 'success',
            count: 0,
            data: [{}]
        });
    }
});

exports.createConta = asyncErrorHandler(async (request, response, next) => {
    request.body.criadoPor = request.user._id;
    const conta = await Conta.create(request.body)

    const varDate = new Date();
    request.user.contaStats.lastModified = varDate;
    request.user.contasStatsDashboard.lastModified = varDate;
    request.user.contas = request.user.contas + 1;

    await User.findByIdAndUpdate(request.user._id, request.user, { new: true, runValidators: true });

    response.status(201).json({
        status: 'success',
        data: {
            conta
        }
    });
});

exports.updateConta = asyncErrorHandler(async (request, response, next) => {
    if (request.body.quitado === "Sim") { 
        request.body.vencimento = new Date();
    } else {
        return next(new CustomError("Você não pode mudar o status de quitado de 'Sim' para 'Não'."));
    }

    const updatedConta = await Conta.findOneAndUpdate(
        { _id: request.body.id, criadoPor: request.user._id },
        request.body, { new: true, runValidators: true });

    const varDate = new Date();
    request.user.contaStats.lastModified = varDate;
    request.user.contasStatsDashboard.lastModified = varDate;

    await User.findByIdAndUpdate(request.user._id, request.user, { new: true, runValidators: true });

    if (updatedConta) {
        response.status(200).json({
            status: 'success',
            data: {
                updatedConta
            }
        });
    } else {
        response.status(404).json({
            status: "not found",
            data: {}
        });
    }
});

exports.deleteConta = asyncErrorHandler(async (request, response, next) => {

    const confirmar = await Conta.find({ criadoPor: request.user._id, _id: request.params.id });
    if (Array.isArray(confirmar) && confirmar.length > 0 && typeof confirmar[0] === 'object') {
        await Conta.findOneAndDelete({ criadoPor: request.user._id, _id: request.params.id });

        const varDate = new Date();
        request.user.contaStats.lastModified = varDate;
        request.user.contasStatsDashboard.lastModified = varDate;

        request.user.contas = request.user.contas - 1;
        await User.findByIdAndUpdate(request.user._id, request.user, { new: true, runValidators: true });
    }

    response.status(204).json({
        status: 'success',
        data: null
    });
});