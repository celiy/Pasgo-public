const mongoose = require('mongoose');
//objeto do schema e model para inserir itens da database
const Cliente = require('./../models/clientesModel');
const Funcionario = require('./../models/funcionariosModel');
const Fornecedor = require('./../models/fornecedoresModel');
const Produto = require('./../models/produtosModel');
const Venda = require('./../models/vendasModel');
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

////////////////////////////////////////////////////////////////////////
//CLIENTES////CLIENTES////CLIENTES////CLIENTES////CLIENTES////CLIENTES//
////////////////////////////////////////////////////////////////////////

exports.getClientes = asyncErrorHandler(async (request, response, next) => {

    if (request.user.clientes > 0){
        //pegar todos da database
        //ou especificos dado um valor   

        //Classe que contem features essenciais
        //Filtra os parametros
        const features = new ApiFeatures(Cliente.find({criadoPor: request.user._id}), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const clientes = await features.query;
        
        response.status(200).json({
            status: 'success',
            count: request.user.clientes,
            data: {
                clientes
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

exports.createCliente = asyncErrorHandler(async (request, response, next) => {
    //inserir na database
    request.body.criadoPor = request.user._id;
    const cliente = await Cliente.create(request.body) //request.body tem os novos arquivos
    
    request.user.clientes = request.user.clientes + 1;
    await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    
    response.status(201).json({
        status: 'success',
        data: {
            cliente
        }
    });
});

exports.updateCliente = asyncErrorHandler (async (request, response, next) => {
    const updatedCliente = await Cliente.findOneAndUpdate(
        {_id: request.body.id, criadoPor: request.user._id}, 
        request.body, {new: true, runValidators: true}); 

    await Venda.updateMany({'cliente.id': request.body.id, criadoPor: request.user._id}, 
        { $set: {'cliente.nome': request.body.nome}});
                
    await Conta.updateMany({'entidade.id': request.body.id, criadoPor: request.user._id}, 
        { $set: {'entidade.nome': request.body.nome}});

    response.status(200).json({               
        status: 'success',                    
        data: {
            updatedCliente
        }
    });
});

exports.deleteCliente = asyncErrorHandler (async (request, response, next) => {

    const confirmar = await Cliente.find({criadoPor: request.user._id, _id: request.params.id});
    if (Array.isArray(confirmar) && confirmar.length > 0 && typeof confirmar[0] === 'object') {
        await Cliente.findOneAndDelete({criadoPor: request.user._id, _id: request.params.id});

        request.user.clientes = request.user.clientes - 1;
        await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    }

    response.status(204).json({
        status: 'success',
        data: null
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////
//FORNECEDORES////FORNECEDORES////FORNECEDORES////FORNECEDORES////FORNECEDORES////FORNECEDORES//
////////////////////////////////////////////////////////////////////////////////////////////////

exports.getFornecedores = asyncErrorHandler(async (request, response, next) => {

    if (request.user.fornecedores > 0){
        //pegar todos da database
        //ou especificos dado um valor   

        //Classe que contem features essenciais
        //Filtra os parametros
        const features = new ApiFeatures(Fornecedor.find({criadoPor: request.user._id}), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const fornecedores = await features.query;
        
        response.status(200).json({
            status: 'success',
            count: request.user.fornecedores,
            data: {
                fornecedores
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

exports.createFornecedores = asyncErrorHandler(async (request, response, next) => {

    request.body.criadoPor = request.user._id;
    const fornecedor = await Fornecedor.create(request.body) //request.body tem os novos arquivos
    
    request.user.fornecedores = request.user.fornecedores + 1;
    await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    
    response.status(201).json({
        status: 'success',
        data: {
            fornecedor
        }
    });
});

exports.updateFornecedores = asyncErrorHandler (async (request, response, next) => {
    const updatedFornecedor = await Fornecedor.findOneAndUpdate(
        {_id: request.body.id, criadoPor: request.user._id}, 
        request.body, {new: true, runValidators: true}); 

    await Produto.updateMany({'fornecedor.id': request.body.id, criadoPor: request.user._id}, 
        { $set: {'fornecedor.nome': request.body.nome}});
                        
    await Conta.updateMany({'entidade.id': request.body.id, criadoPor: request.user._id}, 
        { $set: {'entidade.nome': request.body.nome}});

    response.status(200).json({               
        status: 'success',                    
        data: {
            updatedFornecedor
        }
    });
});
    
exports.deleteFornecedores = asyncErrorHandler (async (request, response, next) => {

    const confirmar = await Fornecedor.find({criadoPor: request.user._id, _id: request.params.id});
    if (Array.isArray(confirmar) && confirmar.length > 0 && typeof confirmar[0] === 'object') {
        await Fornecedor.findOneAndDelete({criadoPor: request.user._id, _id: request.params.id});

        request.user.fornecedores = request.user.fornecedores - 1;
        await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    }
    
    response.status(204).json({
        status: 'success',
        data: confirmar
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCIONARIOS////FUNCIONARIOS////FUNCIONARIOS////FUNCIONARIOS////FUNCIONARIOS////FUNCIONARIOS//
////////////////////////////////////////////////////////////////////////////////////////////////

exports.getFuncionarios = asyncErrorHandler(async (request, response, next) => {

    if (request.user.funcionarios > 0){
        //pegar todos da database
        //ou especificos dado um valor   

        //Classe que contem features essenciais
        //Filtra os parametros
        const features = new ApiFeatures(Funcionario.find({criadoPor: request.user._id}), request.query)
            .filter()
            .sort()
            .limitFields();
        await features.paginate();

        const funcionarios = await features.query;
        
        response.status(200).json({
            status: 'success',
            count: request.user.funcionarios,
            data: {
                funcionarios
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

exports.createFuncionario = asyncErrorHandler(async (request, response, next) => {

    //inserir na database
    request.body.criadoPor = request.user._id;
    const funcionario = await Funcionario.create(request.body) //request.body tem os novos arquivos
    
    request.user.funcionarios = request.user.funcionarios + 1;
    await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    
    response.status(201).json({
        status: 'success',
        data: {
            funcionario
        }
    });
});

exports.updateFuncionario = asyncErrorHandler (async (request, response, next) => {
    const updatedFuncionario = await Funcionario.findOneAndUpdate(
        {_id: request.body.id, criadoPor: request.user._id}, 
        request.body, {new: true, runValidators: true}); 

    await Venda.updateMany({'funcionario.id': request.body.id, criadoPor: request.user._id}, 
        { $set: {'funcionario.nome': request.body.nome}});
                    
    await Conta.updateMany({'entidade.id': request.body.id, criadoPor: request.user._id}, 
        { $set: {'entidade.nome': request.body.nome}});

    response.status(200).json({               
        status: 'success',                    
        data: {
            updatedFuncionario
        }
    });
});

exports.deleteFuncionario = asyncErrorHandler (async (request, response, next) => {

    const confirmar = await Funcionario.find({criadoPor: request.user._id, _id: request.params.id});
    if (Array.isArray(confirmar) && confirmar.length > 0 && typeof confirmar[0] === 'object') {
        await Funcionario.findOneAndDelete({criadoPor: request.user._id, _id: request.params.id});

        request.user.funcionarios = request.user.funcionarios - 1;
        await User.findByIdAndUpdate(request.user._id, request.user, {new: true, runValidators: true});
    }
    response.status(204).json({
        status: 'success',
        data: null
    });
});