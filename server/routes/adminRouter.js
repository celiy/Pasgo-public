const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.route('/login')
    .post(adminController.login);

router.route('/check-login')
    .get(adminController.secure, adminController.checkLogin);

router.route('/logs/:type')
    .get(adminController.secure, adminController.getLogs);

router.route('/users')
    .get(adminController.secure, adminController.getUsers)
    .patch(adminController.secure, adminController.updateUser)
router.route('/users/:_id')
    .delete(adminController.secure, adminController.deleteUser)

router.route('/clientes')
    .get(adminController.secure, adminController.getClientes)
    .patch(adminController.secure, adminController.updateCliente)
router.route('/clientes/:_id')
    .delete(adminController.secure, adminController.deleteCliente)

router.route('/funcionarios')
    .get(adminController.secure, adminController.getFuncionarios)
    .patch(adminController.secure, adminController.updateFuncionario)
router.route('/funcionarios/:_id')
    .delete(adminController.secure, adminController.deleteFuncionario)

router.route('/fornecedores')
    .get(adminController.secure, adminController.getFornecedores)
    .patch(adminController.secure, adminController.updateFornecedor)
router.route('/fornecedores/:_id')
    .delete(adminController.secure, adminController.deleteFornecedor)

router.route('/produtos')
    .get(adminController.secure, adminController.getProdutos)
    .patch(adminController.secure, adminController.updateProduto)
router.route('/produtos/:_id')
    .delete(adminController.secure, adminController.deleteProduto)

router.route('/vendas')
    .get(adminController.secure, adminController.getVendas)
    .patch(adminController.secure, adminController.updateVenda)
router.route('/vendas/:_id')
    .delete(adminController.secure, adminController.deleteVenda)

router.route('/contas')
    .get(adminController.secure, adminController.getContas)
    .patch(adminController.secure, adminController.updateConta)
router.route('/contas/:_id')
    .delete(adminController.secure, adminController.deleteConta)

router.route('/caixas')
    .get(adminController.secure, adminController.getCaixas)
    .patch(adminController.secure, adminController.updateCaixa)
router.route('/caixas/:_id')
    .delete(adminController.secure, adminController.deleteCaixa)

router.route('/servicos')
    .get(adminController.secure, adminController.getServicos)
    .patch(adminController.secure, adminController.updateServico)
router.route('/servicos/:_id')
    .delete(adminController.secure, adminController.deleteServico)

router.route('/ordens')
    .get(adminController.secure, adminController.getOrdens)
    .patch(adminController.secure, adminController.updateOrdem)
router.route('/ordens/:_id')
    .delete(adminController.secure, adminController.deleteOrdem)

module.exports = router;