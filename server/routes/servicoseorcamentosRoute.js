//Este arquivo cuida do routing para as APIs
//Ele usa um modulo  de convenção de nome nomeapiController que tem as funções de cada routing de API
const express = require('express');
const servicoseorcamentosController = require('./../controllers/servicoseorcamentosController');
//autenticação executada antes de um get/post ser feito
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/servicos')
    .get(authController.protect, servicoseorcamentosController.getServicos)
    .post(authController.protect, servicoseorcamentosController.createServico)
    .patch(authController.protect, servicoseorcamentosController.updateServico)
    .delete(authController.protect, servicoseorcamentosController.deleteServico)

router.route('/servicos/:id')
    .delete(authController.protect, servicoseorcamentosController.deleteServico)

router.route('/ordens-servicos')
    .get(authController.protect, servicoseorcamentosController.getOrdemServicos)
    .post(authController.protect, 
        servicoseorcamentosController.uploadOrdemImages, 
        servicoseorcamentosController.processOrdemImages,
        servicoseorcamentosController.createOrdemServico)
    .patch(authController.protect,
        servicoseorcamentosController.uploadOrdemImages,
        servicoseorcamentosController.processOrdemImages,
        servicoseorcamentosController.updateOrdemServico)
    .delete(authController.protect, servicoseorcamentosController.deleteOrdemServico)

router.route('/ordens-servicos/:id')
    .delete(authController.protect, servicoseorcamentosController.deleteOrdemServico)

router.route('/ordens-servicos/:id/imagens')
    .get(authController.protect, servicoseorcamentosController.getOrdemImages)

module.exports = router;