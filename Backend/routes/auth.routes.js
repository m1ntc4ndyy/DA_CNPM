const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth , authController.getProfile);
router.put('/change-password', auth, authController.changePassword);
module.exports = router;