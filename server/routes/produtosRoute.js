//Este arquivo cuida do routing para as APIs
//Ele usa um modulo  de convenção de nome nomeapiController que tem as funções de cada routing de API
const express = require('express');
const produtosController = require('./../controllers/produtosController');
//autenticação executada antes de um get/post ser feito
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/produtosAPI')
    .get(authController.protect, produtosController.getProdutos)
    .post(authController.protect, produtosController.createProduto)
    .patch(authController.protect, produtosController.updateProduto)
    .delete(authController.protect, produtosController.deleteProduto)

router.route('/produtosAPI/:codigo')
    .get(authController.protect, produtosController.getOneProduto)
    .patch(authController.protect, produtosController.updateProdutoByCode)

router.route('/produtosAPI/:id')
    .delete(authController.protect, produtosController.deleteProduto)

module.exports = router;