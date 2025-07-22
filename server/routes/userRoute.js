const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

router.route('/info').get(authController.protect, userController.getUser);
router.route('/update-password/').patch(authController.protect, userController.updatePassword);
router.route('/update-me/').patch(authController.protect, userController.updateMe);
router.route('/support/').post(authController.protect, userController.support);
router.route('/delete-account/').post(authController.protect, userController.scheduleDelete);
router.route('/revert-account-deletion/').post(userController.revertAccountDeletion);

module.exports = router;