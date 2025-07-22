//Este arquivo cuida do routing para as APIs
//Ele usa um modulo  de convenção de nome nomeapiController que tem as funções de cada routing de API
const express = require('express');
const financeiroController = require('./../controllers/financeiroController');
//autenticação executada antes de um get/post ser feito
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/contas')
    .get(authController.protect, financeiroController.getContas)
    .post(authController.protect, financeiroController.createConta)
    .patch(authController.protect, financeiroController.updateConta)
    .delete(authController.protect, financeiroController.deleteConta)
    
router.route('/contas-stats')
    .get(authController.protect, financeiroController.getContasStats)

router.route('/contas-stats-dashboard')
    .get(authController.protect, financeiroController.getContasStatsDashboard)

router.route('/contas/:id')
    .delete(authController.protect, financeiroController.deleteConta)

module.exports = router;