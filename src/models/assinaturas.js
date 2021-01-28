'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    crm: {
        type: Number,
        required: true,
        trim: true
    },
    ass: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Assinatura', schema);