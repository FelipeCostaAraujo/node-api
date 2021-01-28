'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller');
const authService = require('../services/auth-service');

router.get('/', controller.get);
router.get('/list-all', controller.getAll);
router.get('/:slug', controller.getBySlug);
router.get('/getid/:id', controller.getById);
router.get('/tags/:tag', controller.getByTag);

router.post('/', authService.isAdmin, controller.post);
router.put('/:id', authService.isAdmin, controller.put);
router.delete('/delete-product', authService.isAdmin, controller.delete)

module.exports = router;