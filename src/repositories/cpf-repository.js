'use strict';
const mongoose = require('mongoose');
const Cpf = mongoose.model('Cpf');

exports.create = async (data) => {
    var customer = new Cpf(data);
    await customer.save();
}

exports.authenticate = async (data) => {
    const res = await Cpf.findOne({
        cpf: data.cpf,
        password: data.password
    });
    return res;
}

exports.getById = async (id) => {
    const res = await Cpf.findById(id);
    return res;
}