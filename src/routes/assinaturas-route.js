'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/assinaturas');
const authService = require('../services/auth-service');

router.post('/', controller.post);

module.exports = router;