const mongoose = require('mongoose');
const validator = require('validator');
//lib para incripitação (hashing)
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

//schema e model
//schema - template de item para ser inserido na database

//schema: template generico
const genericSchema = new mongoose.Schema({
    userEmail: String,
    registerEmailCode: String,
    requestedAt: Date,
});

//model do schema
const Generic = mongoose.model('Generic', genericSchema);

module.exports = Generic;