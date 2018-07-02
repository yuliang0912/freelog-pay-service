'use strict'

module.exports = app => {

    const mongoose = app.mongoose

    const TransactionPassword = new mongoose.Schema({
        userId: {type: Number, required: true, unique: true},
        salt: {type: String, required: true},
        password: {type: String, required: true},
        status: {type: Number, default: 1, required: false}  // 1.正常
    }, {
        versionKey: false,
        bufferCommands: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    TransactionPassword.index({userId: 1}, {unique: true});

    return mongoose.model('transaction-passwords', TransactionPassword)
}