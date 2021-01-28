'use strict';

const mongoose = require('mongoose');
const Assinatura = mongoose.model('Assinatura');

exports.create = async (data) => {
    const assinatura = new Assinatura(data);
    await assinatura.save();
}