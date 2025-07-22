const express = require('express');
const router = express.Router();
const mockController = require('../controllers/mockController');

router.route('/create').post(mockController.generateMock);
router.route('/delete').delete(mockController.deleteMock);

module.exports = router;