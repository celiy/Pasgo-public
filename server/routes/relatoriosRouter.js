//Este arquivo cuida do routing para as APIs
//Ele usa um modulo  de convenção de nome nomeapiController que tem as funções de cada routing de API
const express = require('express');
const relatoriosController = require('./../controllers/relatoriosController');
//autenticação executada antes de um get/post ser feito
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/vendas')
    .get(authController.protect, relatoriosController.getRelatoriosVendas)

router.route('/contas')
    .get(authController.protect, relatoriosController.getRelatoriosContas)

router.route('/ordens-servico')
    .get(authController.protect, relatoriosController.getRelatoriosOrdens)

router.route('/comissoes')
    .post(authController.protect, relatoriosController.getComissaoServicos)

module.exports = router;