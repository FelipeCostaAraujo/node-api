'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/cpf-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');
const emailService = require('../services/email-service');

exports.post = async (req, res, next) => {
    const contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');
 
    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            cpf: req.body.cpf,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ["user"]
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Node Store by FelipeAraujo',
            global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(201).send({
            sucesso: true,
            message: 'Cliente cadastrado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            sucesso: false,
            message: 'Falha ao processar sua requisição'
        });
        console.log(e)
    }
};

exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repository.authenticate({
            cpf: req.body.cpf,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.send({
                sucesso: false,
                message: 'Usuário ou senha inválidos'
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            cpf: customer.cpf,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            sucesso: true,
            token: token,
            data: {
                cpf: customer.cpf,
                name: customer.name,
                roles: customer.roles
            }
        });
    } catch (e) {
        res.status(500).send({
            sucesso: false,
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            cpf: customer.cpf,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            sucesso: true,
            token: token,
            data: {
                cpf: customer.cpf,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            sucesso: false,
            message: 'Falha ao processar sua requisição'
        });
    }
};