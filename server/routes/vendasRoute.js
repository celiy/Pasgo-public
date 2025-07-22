//Este arquivo cuida do routing para as APIs
//Ele usa um modulo  de convenção de nome nomeapiController que tem as funções de cada routing de API
const express = require('express');
const vendasController = require('./../controllers/vendasController');
//autenticação executada antes de um get/post ser feito
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/vendasAPI')
    .get(authController.protect, vendasController.getVendas)
    .post(authController.protect, vendasController.createVenda)
    .patch(authController.protect, vendasController.updateVenda)
    .delete(authController.protect, vendasController.deleteVenda)

router.route('/vendasAPI-stats')
    .get(authController.protect, vendasController.getVendasStats)

router.route('/vendasAPI-stats-dashboard')
    .get(authController.protect, vendasController.getVendasStatsDashboard)
    
router.route('/vendasAPI/:id')
    .delete(authController.protect, vendasController.deleteVenda)

router.route('/caixaAPI')
    .get(authController.protect, vendasController.getCaixaStats)
    .post(authController.protect, vendasController.createVendaCaixa)

router.route('/caixaAPI/:id')
    .delete(authController.protect, vendasController.deleteCaixa)

router.route('/caixaAPI-vendas')
    .get(authController.protect, vendasController.getVendasCaixas)

module.exports = router;