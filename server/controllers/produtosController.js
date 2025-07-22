const mongoose = require('mongoose');
//objeto do schema e model para inserir itens da database
const Produto = require('./../models/produtosModel');
const User = require('./../models/userModel');
const Venda = require('./../models/vendasModel');
//Features reusaveis
const ApiFeatures = require('./../utils/ApiFeatures');
//Middleware para router ('/highest-rated') que retorna os filmes com maior ratings
//Ele só modifica o query antes do getAllMovies

const CustomError = require('./../utils/CustomError');

//Função que quando dada uma função de um controller, pega o erro da função, sem o uso de try catch dentro
//para usar o handling de erros globais
const asyncErrorHandler = require('./../utils/asyncErrorHandler');

exports.getProdutos = asyncErrorHandler(async (request, response, next) => {

    if (request.user.produtos > 0){
        const features = new ApiFeatures(Produto.find({criadoPor: request.user._id}), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const produtos = await features.query;

        response.status(200).json({
            status: 'success',
            count: request.user.produtos,
            data: {
                produtos
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

exports.getOneProduto = asyncErrorHandler(async (request, response, next) => {

    if (request.user.produtos > 0){
        const produto = await Produto.findOne({criadoPor: request.user._id, codigo: request.params.codigo}, {nome: 1, codigo: 1, _id: 0, valor: 1});

        response.status(200).json({
            status: 'success',
            data: {
                produto
            }
        });
    } else {
        response.status(200).json({
            status: 'success',
            count: 0,
            data: {}
        });
    }
});

exports.createProduto = asyncErrorHandler(async (request, response, next) => {
    request.body.criadoPor = request.user._id;
    const produto = await Produto.create(request.body)
    
    request.user.produtos = request.user.produtos + 1;
    await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    
    response.status(201).json({
        status: 'success',
        data: {
            produto
        }
    });
});

exports.updateProduto = asyncErrorHandler (async (request, response, next) => {
    const updatedProduto = await Produto.findOneAndUpdate(
        {_id: request.body.id, criadoPor: request.user._id}, 
        request.body, {new: true, runValidators: true}
    ); 

    response.status(200).json({               
        status: 'success',                    
        data: {
            updatedProduto
        }
    });
});

exports.updateProdutoByCode = asyncErrorHandler (async (request, response, next) => {
    const updatedProduto = await Produto.findOneAndUpdate(
        {codigo: request.params.codigo, criadoPor: request.user._id}, 
        { $inc: { quantidade: request.body.quantidade } }, {new: true, runValidators: true}
    ); 

    if (updatedProduto) {
        response.status(200).json({               
            status: 'success',                    
            data: {
                updatedProduto
            }
        });
    } else {
        response.status(404).json({
            status: "not found",
            data: {}
        });
    }
});

exports.deleteProduto = asyncErrorHandler (async (request, response, next) => {

    const confirmar = await Produto.find({criadoPor: request.user._id, _id: request.params.id});
    if (Array.isArray(confirmar) && confirmar.length > 0 && typeof confirmar[0] === 'object') {
        await Produto.findOneAndDelete({criadoPor: request.user._id, _id: request.params.id});

        request.user.produtos = request.user.produtos - 1;
        await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    }

    response.status(204).json({
        status: 'success',
        data: null
    });
});