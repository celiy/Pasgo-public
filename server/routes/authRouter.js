const express = require('express');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/check-login').post(authController.protect, authController.checkLogin);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').delete(authController.logout);
router.route('/accept-device').post(authController.acceptDevice);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').post(authController.resetPassword);
router.route('/verify-captcha').post(authController.verifyCaptcha);

module.exports = router;