const mongoose = require('mongoose');
const Cliente = require('../models/clientesModel');
const Funcionario = require('../models/funcionariosModel');
const Fornecedor = require('../models/fornecedoresModel');
const Produto = require('../models/produtosModel');
const Venda = require('../models/vendasModel');
const Conta = require('../models/contasModel');
const Caixa = require('../models/caixaModel');
const Servico = require('../models/servicosModel');
const Ordem = require('../models/ordemServicoModel');
const User = require('../models/userModel');
const ApiFeatures = require('./../utils/ApiFeatures');

const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/CustomError');
const fs = require("fs");

const options = {
    // 24 horas
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
}

exports.secure = asyncErrorHandler(async (request, response, next) => {
    if (request.cookies.login !== process.env.ADMIN_LOGIN || request.cookies.password !== process.env.ADMIN_PASSWORD) {
        return next(new CustomError('Credenciais inválidas', 401));
    }

    next();
});

exports.checkLogin = asyncErrorHandler(async (request, response, next) => {
    response.status(200).json({
        status: 'success',
    });
});

exports.login = asyncErrorHandler(async (request, response, next) => {
    if (request.body.login !== process.env.ADMIN_LOGIN || request.body.password !== process.env.ADMIN_PASSWORD) {
        return next(new CustomError('Credenciais inválidas', 401));
    }

    response.cookie('login', request.body.login, options);
    response.cookie('password', request.body.password, options);

    response.status(200).json({
        status: 'success',
    });
});

exports.getLogs = asyncErrorHandler(async (request, response, next) => {
    fs.readFile(`./logs/${request.params.type}.log`, 'utf8', (err, data) => {
        if (err) {
            return next(new CustomError('Falha ao ler os logs', 500));
        }

        try {
            const logsArray = data
                .split('\n')
                .filter(line => line.trim() !== '')
                .map(line => JSON.parse(line));

            response.status(200).json({
                status: 'success',
                data: {
                    logs: logsArray
                }
            });

        } catch (parseError) {
            return next(new CustomError('Formato de log inválido', 500));
        }
    });
});

exports.getUsers = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(User.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const users = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});

exports.updateUser = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await User.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteUser = asyncErrorHandler(async (request, response, next) => {
    await User.findByIdAndDelete({ _id: request.params._id });

    await Cliente.deleteMany({ criadoPor: request.params._id });
    await Fornecedor.deleteMany({ criadoPor: request.params._id });
    await Funcionario.deleteMany({ criadoPor: request.params._id });
    await Produto.deleteMany({ criadoPor: request.params._id });
    await Servico.deleteMany({ criadoPor: request.params._id });
    await Ordem.deleteMany({ criadoPor: request.params._id });
    await Venda.deleteMany({ criadoPor: request.params._id });
    await Caixa.deleteMany({ criadoPor: request.params._id });
    await Conta.deleteMany({ criadoPor: request.params._id });

    response.status(200).json({
        status: 'success',
    });
});

exports.getClientes = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(Cliente.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const clientes = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            clientes
        }
    });
});

exports.updateCliente = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await Cliente.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteCliente = asyncErrorHandler(async (request, response, next) => {
    const cliente = await Cliente.findByIdAndDelete({ _id: request.params._id });
    await User.findByIdAndUpdate({ _id: cliente.criadoPor }, { $inc: { clientes: -1 } });

    response.status(200).json({
        status: 'success',
    });
});

exports.getFuncionarios = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(Funcionario.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const funcionarios = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            funcionarios
        }
    });
});

exports.updateFuncionario = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await Funcionario.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteFuncionario = asyncErrorHandler(async (request, response, next) => {
    const funcionario = await Funcionario.findByIdAndDelete({ _id: request.params._id });
    await User.findByIdAndUpdate({ _id: funcionario.criadoPor }, { $inc: { funcionarios: -1 } });

    response.status(200).json({
        status: 'success',
    });
});

exports.getFornecedores = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(Fornecedor.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const fornecedores = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            fornecedores
        }
    });
});

exports.updateFornecedor = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await Fornecedor.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteFornecedor = asyncErrorHandler(async (request, response, next) => {
    const fornecedor = await Fornecedor.findByIdAndDelete({ _id: request.params._id });
    await User.findByIdAndUpdate({ _id: fornecedor.criadoPor }, { $inc: { fornecedores: -1 } });

    response.status(200).json({
        status: 'success',
    });
});

exports.getProdutos = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(Produto.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const produtos = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            produtos
        }
    });
});

exports.updateProduto = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await Produto.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteProduto = asyncErrorHandler(async (request, response, next) => {
    const produto = await Produto.findByIdAndDelete({ _id: request.params._id });
    await User.findByIdAndUpdate({ _id: produto.criadoPor }, { $inc: { produtos: -1 } });

    response.status(200).json({
        status: 'success',
    });
});

exports.getVendas = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(Venda.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const vendas = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            vendas
        }
    });
});

exports.updateVenda = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await Venda.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteVenda = asyncErrorHandler(async (request, response, next) => {
    const venda = await Venda.findByIdAndDelete({ _id: request.params._id });
    await User.findByIdAndUpdate({ _id: venda.criadoPor }, { $inc: { vendas: -1 } });

    response.status(200).json({
        status: 'success',
    });
});

exports.getContas = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(Conta.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const contas = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            contas
        }
    });
});

exports.updateConta = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await Conta.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteConta = asyncErrorHandler(async (request, response, next) => {
    const conta = await Conta.findByIdAndDelete({ _id: request.params._id });
    await User.findByIdAndUpdate({ _id: conta.criadoPor }, { $inc: { contas: -1 } });

    response.status(200).json({
        status: 'success',
    });
});

exports.getCaixas = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(Caixa.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const caixas = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            caixas
        }
    });
});

exports.updateCaixa = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await Caixa.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteCaixa = asyncErrorHandler(async (request, response, next) => {
    const caixa = await Caixa.findByIdAndDelete({ _id: request.params._id });
    await User.findByIdAndUpdate({ _id: caixa.criadoPor }, { $inc: { caixas: -1 } });

    response.status(200).json({
        status: 'success',
    });
});

exports.getServicos = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(Servico.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const servicos = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            servicos
        }
    });
});

exports.updateServico = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await Servico.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteServico = asyncErrorHandler(async (request, response, next) => {
    const servico = await Servico.findByIdAndDelete({ _id: request.params._id });
    await User.findByIdAndUpdate({ _id: servico.criadoPor }, { $inc: { servicos: -1 } });

    response.status(200).json({
        status: 'success',
    });
});

exports.getOrdens = asyncErrorHandler(async (request, response, next) => {
    const features = new ApiFeatures(Ordem.find(), request.query)
        .filter()
        .sort()
        .limitFields();
    await features.paginate();

    const ordens = await features.query;
    
    response.status(200).json({
        status: 'success',
        data: {
            ordens
        }
    });
});

exports.updateOrdem = asyncErrorHandler(async (request, response, next) => {
    const override = !request.body.override;

    await Ordem.findByIdAndUpdate({ _id: request.body._id }, request.body, {new: override, runValidators: override});
    
    response.status(200).json({
        status: 'success',
    });
});

exports.deleteOrdem = asyncErrorHandler(async (request, response, next) => {
    const ordem = await Ordem.findByIdAndDelete({ _id: request.params._id });
    await User.findByIdAndUpdate({ _id: ordem.criadoPor }, { $inc: { ordens: -1 } });

    response.status(200).json({
        status: 'success',
    });
});