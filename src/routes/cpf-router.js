'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/cpf-controller');
const authService = require('../services/auth-service');

router.post('/', controller.post);
router.post('/authenticate', controller.authenticate);
router.post('/refresh-token',controller.refreshToken);

module.exports = router;