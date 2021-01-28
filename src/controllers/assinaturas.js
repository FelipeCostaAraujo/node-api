'use strict';

const repository = require('../repositories/assinaturas-repository');
const ValidationContract = require('../validators/fluent-validator');
const config = require('../config');
const guid = require('guid');
const azure = require('azure-storage');


exports.post = async (req, res, next) => {

    try {
        //cria o blob service
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = req.body.crm + '.jpg';
        let rawdata = req.body.ass;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');
        // Salva a imagem
        await blobSvc.createBlockBlobFromText('assinaturas-h9j', filename , buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error) {
                filename = 'default-product.png'
            }
        });

        // await repository.create({
        //     crm: req.body.crm,
        //     ass: 'https://felipecaraujo.blob.core.windows.net/assinaturas-h9j/' + filename
        // });
        res.status(201).send({
            message: 'Assinatura salva com sucesso!',
        });
    } catch (e) {
        console.log(e)
        res.status(400).send({
            message: 'Falha ao cadastrar',
            data: e
        });
    }
};