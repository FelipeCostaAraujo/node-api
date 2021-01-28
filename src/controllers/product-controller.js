'use strict';

const repository = require('../repositories/product-repository');
const ValidationContract = require('../validators/fluent-validator');
const config = require('../config');
const guid = require('guid');
const azure = require('azure-storage');

exports.get = async (req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send({
            sucesso: true,
            data: data
        });
    } catch (e) {
        res.status(500).send({
            sucesso: false,
            message: "Falha ao processar sua requisicao"
        });
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const data = await repository.getAll()
        res.status(200).send({
            'sucesso': true,
            data: data
        })
    } catch (e) {
        res.status(400).send({
            'sucesso': false,
            data: e
        })
    }

}

exports.getBySlug = async (req, res, next) => {
    try {
        const data = await repository.getBySlug(req.params.slug)
        res.status(200).send({
            'sucesso': true,
            data: data
        });
    } catch (e) {
        res.status(400).send({
            'sucesso': false,
            data: e
        });
    }
}


exports.getById = async (req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);
        res.status(200).send({
            'sucesso': true,
            data: data
        });
    } catch (e) {
        res.status(400).send({
            'sucesso': false,
            data: e
        });
    }
}

exports.getByTag = async (req, res, next) => {
    try {
        const data = await repository.getByTag(req.params.tag);
        res.status(200).send({
            'sucesso': true,
            data: data
        });
    } catch (e) {
        res.status(400).send({
            'sucesso': false,
            data: e
        });
    }
}

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O titulo deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A descricao deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.price, 1, 'O preco nao pode ser vazio');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }


    try {
        //cria o blob service
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');
        // Salva a imagem
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error) {
                filename = 'default-product.png'
            }
        });

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: 'https://felipecaraujo.blob.core.windows.net/product-images/' + filename
        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!',
        });
    } catch (e) {
        console.log(e)
        res.status(400).send({
            message: 'Falha ao cadastrar',
            data: e
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            sucesso: true,
            message: 'Produto atualizado com sucesso'
        });
    } catch (e) {
        res.status(400).send({
            sucesso: false,
            message: 'Falha ao atualizar produto'
        })
    }
};

exports.delete = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.id, 1, 'O id esta vazio');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        await repository.delete(req.body.id);
        res.status(200).send({
            sucesso: true,
            message: 'Produto removido com sucesso '
        });
    } catch (e) {
        res.status(400).send({
            sucesso: false,
            message: 'Falha ao remover produto' + req.body.id
        })
    }
};