const Venda = require('./../models/vendasModel');
const Conta = require('./../models/contasModel');
const Ordem = require('./../models/ordemServicoModel.js');
const Servico = require('./../models/servicosModel');
const ApiFeatures = require('./../utils/ApiFeatures');

//Função que quando dada uma função de um controller, pega o erro da função, sem o uso de try catch dentro
//para usar o handling de erros globais
const asyncErrorHandler = require('./../utils/asyncErrorHandler');

exports.getRelatoriosVendas = asyncErrorHandler(async (request, response, next) => {
    if (request.user.vendas > 0) {
        const features = new ApiFeatures(Venda.find({ criadoPor: request.user._id }), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const relatorio = await features.query;

        response.status(200).json({
            status: 'success',
            data: {
                relatorio
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

exports.getRelatoriosContas = asyncErrorHandler(async (request, response, next) => {
    if (request.user.vendas > 0) {
        const features = new ApiFeatures(Conta.find({ criadoPor: request.user._id }), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const relatorio = await features.query;

        response.status(200).json({
            status: 'success',
            data: {
                relatorio
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

exports.getRelatoriosOrdens = asyncErrorHandler(async (request, response, next) => {
    if (request.user.vendas > 0) {
        const features = new ApiFeatures(Ordem.find({ criadoPor: request.user._id }), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const relatorio = await features.query;

        response.status(200).json({
            status: 'success',
            data: {
                relatorio
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

exports.getComissaoServicos = asyncErrorHandler(async (request, response, next) => {
    if (request.user.servicos > 0) {
        const comissoes = await Servico.find({ _id: { $in: request.body.servicosID } }, { _id: 1, comissao: 1});

        response.status(200).json({
            status: 'success',
            data: {
                comissoes
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