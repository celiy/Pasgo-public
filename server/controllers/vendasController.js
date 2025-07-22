const mongoose = require('mongoose');
//objeto do schema e model para inserir itens da database
const Venda = require('./../models/vendasModel');
const Caixa = require('./../models/caixaModel');
const User = require('./../models/userModel');
const Produto = require('./../models/produtosModel');
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

exports.getVendasStats = asyncErrorHandler(async (request, response, next) => {
    if (request.user.vendas > 0){
        if ((request.user.vendaStats.current && request.user.vendaStats.lastModified &&
            moment(request.user.vendaStats.lastModified).isAfter(moment(request.user.vendaStats.current).add(1, 'hour')))
            || !request.user.vendaStats.stats) {

            const firstDayOfMonth = moment().subtract(6, 'months').startOf('month').toDate();
            const lastDayOfMonth = moment().endOf('month').toDate();

            const stats = await Venda.find({criadoPor: request.user._id, dataPagamento: {$gte: firstDayOfMonth, $lte: lastDayOfMonth}}, 
                {subtotal: 1, foiPago: 1, dataPagamento: 1, tipoEntidade: 1 }).limit(200);
    
            let vendaStats = {
                vencidos: 0,
                vencemHoje: 0,
                aVencer: 0,
                pago: 0,
            };
    
            const hoje = moment();
    
            stats.forEach(venda => {
                if (venda.dataPagamento){
                    const dataPag = moment(venda.dataPagamento);
    
                    if (dataPag.isBefore(hoje, 'day') && venda.foiPago === "Não"){
                        vendaStats.vencidos = parseFloat((vendaStats.vencidos + venda.subtotal).toFixed(2));
                    } else if (dataPag.isSame(hoje, 'day') && venda.foiPago === "Não"){
                        vendaStats.vencemHoje = parseFloat((vendaStats.vencemHoje + venda.subtotal).toFixed(2));
                    } else if (dataPag.isAfter(hoje, 'day') && venda.foiPago === "Não"){
                        vendaStats.aVencer = parseFloat((vendaStats.aVencer + venda.subtotal).toFixed(2));
                    } else if (venda.foiPago === "Sim"){
                        vendaStats.pago = parseFloat((vendaStats.pago + venda.subtotal).toFixed(2));
                    }
                }
            });
            
            const userStats = {
                lastModified: Date.now(),
                current: Date.now(),
                stats: vendaStats
            }

            request.user.vendaStats = userStats;
            
            await User.findByIdAndUpdate(request.user._id, request.user, { new: true, runValidators: true });

            response.status(200).json({
                status: 'success',
                data: { 
                    vendaStats 
                } 
            });
        } else {
            const vendaStats = request.user.vendaStats.stats;
            response.status(200).json({
                status: 'success',
                data: { 
                    vendaStats 
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

exports.getVendasStatsDashboard = asyncErrorHandler(async (request, response, next) => {
    if (request.user.vendas > 0 && request.user.vendaStatsDashboardFinal?.stats){
        response.status(200).json({
            status: 'success',
            data: { 
                vendaStatsDashboardFinal: request.user.vendaStatsDashboardFinal.stats,
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

exports.getVendas = asyncErrorHandler(async (request, response, next) => {
    if (request.user.vendas > 0){
        const features = new ApiFeatures(Venda.find({criadoPor: request.user._id}), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();
        
        const vendas = await features.query;

        response.status(200).json({
            status: 'success',
            count: request.user.vendas,
            data: {
                vendas
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

exports.createVenda = asyncErrorHandler(async (request, response, next) => {
    request.body.criadoPor = request.user._id;

    const venda = await Venda.create(request.body);

    const produtosList = request.body.produto;
    let produtosIssues = []

    for (let n=0; n<produtosList.length; n++){
        const prod = await Produto.findOneAndUpdate(
            { _id: produtosList[n].id, criadoPor: request.user._id },
            [
                {
                    $set: {
                        quantidade: {
                            $max: [
                                0,
                                { $subtract: ["$quantidade", produtosList[n].quantidade] }
                            ]
                        }
                    }
                }
            ]
        );

        if ((prod.quantidade - produtosList[n].quantidade) <= 0) {
            produtosIssues.push(prod.nome);
        }
    }

    const varDate = new Date();
    request.user.vendaStats.lastModified = varDate;
    request.user.vendaStatsDashboardFinal.lastModified = varDate;
    request.user.vendas = request.user.vendas + 1;
    await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    
    response.status(201).json({
        status: 'success',
        issues: produtosIssues,
        data: {
            venda
        }
    });
});

exports.updateVenda = asyncErrorHandler (async (request, response, next) => {
    if (request.body.foiPago === "Sim") request.body.dataPagamento = new Date();

    const updatedVenda = await Venda.findOneAndUpdate(
        {_id: request.body.id, criadoPor: request.user._id}, 
        request.body, {new: true, runValidators: true}
    ); 

    const varDate = new Date();
    request.user.vendaStats.lastModified = varDate;
    request.user.vendaStatsDashboardFinal.lastModified = varDate;
    await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});

    response.status(200).json({               
        status: 'success',                    
        data: {
            updatedVenda
        }
    });
});

exports.deleteVenda = asyncErrorHandler (async (request, response, next) => {
    const confirmar = await Venda.find({criadoPor: request.user._id, _id: request.params.id});

    if (Array.isArray(confirmar) && confirmar.length > 0 && typeof confirmar[0] === 'object') {
        await Venda.findOneAndDelete({criadoPor: request.user._id, _id: request.params.id});

        const varDate = new Date();
        request.user.vendaStats.lastModified = varDate;
        request.user.vendaStatsDashboardFinal.lastModified = varDate;
        request.user.vendas = request.user.vendas - 1;
        await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    }

    response.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getVendasCaixas = asyncErrorHandler(async (request, response, next) => {
    if (request.user.caixas > 0){
        const features = new ApiFeatures(Caixa.find({criadoPor: request.user._id}), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const vendasCaixas = await features.query;

        response.status(200).json({
            status: 'success',
            count: request.user.caixas,
            data: {
                vendasCaixas
            }
        });
    } else {
        response.status(200).json({
            status: 'success',
            count: 0,
            data: [{produtos: []}]
        });
    }
});

exports.createVendaCaixa = asyncErrorHandler(async (request, response, next) => {
    if (!request.body.produtos.length > 0) {
        return next(new CustomError("A venda do caixa precisa conter pelo menos um produto."));
    }

    request.body.criadoPor = request.user._id;
    request.body.feitoEm = new Date();

    await Caixa.create(request.body);

    const produtosList = request.body.produtos;
    let produtosIssues = []

    for (let n=0; n<produtosList.length; n++){
        try {
            const prod = await Produto.findOneAndUpdate(
                { codigo: produtosList[n].codigo, criadoPor: request.user._id },
                [
                    {
                        $set: {
                            quantidade: {
                                $max: [
                                    0,
                                    { $subtract: ["$quantidade", produtosList[n].quantidade] }
                                ]
                            }
                        }
                    }
                ]
            );

            if (prod.quantidade > 0 && (prod.quantidade - produtosList[n].quantidade) <= 0) {
                produtosIssues.push(prod.nome);
            }
        } catch (error) {}
    }

    request.user.caixaStats.lastModified = new Date();
    request.user.caixas = request.user.caixas + 1;
    await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});

    response.status(201).json({
        status: 'success',
        issues: produtosIssues,
    });
});

exports.getCaixaStats = asyncErrorHandler(async (request, response, next) => {
    if (request.user.caixas > 0 && request.user.caixaStats?.stats){
        response.status(200).json({
            status: 'success',
            data: {
                cached: true,
                stats: request.user.caixaStats
            }
        });
    } else {
        response.status(200).json({
            status: 'success',
            count: 0,
            data: [{produtos: []}]
        });
    }
});

exports.deleteCaixa = asyncErrorHandler (async (request, response, next) => {
    const confirmar = await Caixa.find({criadoPor: request.user._id, _id: request.params.id});

    if (Array.isArray(confirmar) && confirmar.length > 0 && typeof confirmar[0] === 'object') {
        await Caixa.findOneAndDelete({criadoPor: request.user._id, _id: request.params.id});

        request.user.caixaStats.lastModified = new Date();
        request.user.caixas = request.user.caixas - 1;
        await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    }

    response.status(204).json({
        status: 'success',
        data: null
    });
});