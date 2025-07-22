//Este arquivo cuida do routing para as APIs
//Ele usa um modulo  de convenção de nome nomeapiController que tem as funções de cada routing de API
const express = require('express');
const cadastrosController = require('./../controllers/cadastrosController');
//autenticação executada antes de um get/post ser feito
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/clientes')
    .get(authController.protect, cadastrosController.getClientes)
    .post(authController.protect, cadastrosController.createCliente)
    .patch(authController.protect, cadastrosController.updateCliente)
    .delete(authController.protect, cadastrosController.deleteCliente)

router.route('/clientes/:id')
    .delete(authController.protect, cadastrosController.deleteCliente)

router.route('/fornecedores')
    .get(authController.protect, cadastrosController.getFornecedores)
    .post(authController.protect, cadastrosController.createFornecedores)
    .patch(authController.protect, cadastrosController.updateFornecedores)
    .delete(authController.protect, cadastrosController.deleteFornecedores)

router.route('/fornecedores/:id')
    .delete(authController.protect, cadastrosController.deleteFornecedores)

router.route('/funcionarios')
    .get(authController.protect, cadastrosController.getFuncionarios)
    .post(authController.protect, cadastrosController.createFuncionario)
    .patch(authController.protect, cadastrosController.updateFuncionario)
    .delete(authController.protect, cadastrosController.deleteFuncionario)

router.route('/funcionarios/:id')
    .delete(authController.protect, cadastrosController.deleteFuncionario)

module.exports = router;