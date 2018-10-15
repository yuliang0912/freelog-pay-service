/**
 * 账户转账记录
 */

'use strict'

const lodash = require('lodash')
const omitFields = ['_id', 'signature']
const {tradeStatus} = require('../enum/index')

module.exports = app => {

    const mongoose = app.mongoose

    const toJsonOptions = {
        transform(doc, ret, options) {
            return lodash.omit(ret, omitFields)
        }
    }

    const accountTransferRecordSchema = new mongoose.Schema({
        transferId: {type: String, unique: true, required: true},
        fromAccountId: {type: String, required: true}, //来源账户
        toAccountId: {type: String, required: true}, //目标账户
        amount: {type: Number, required: true}, //变动金额
        tradePoundage: {type: Number, default: 0, required: true}, //交易手续费
        operationUserId: {type: Number, default: 0, required: true}, //发起者用户ID
        remark: {type: String, default: '', required: false}, //用户备注
        createDate: {type: Date, default: Date.now, required: true},
        tradeStatus: {
            type: Number, default: 1, required: true,
            enum: [tradeStatus.Pending, tradeStatus.InitiatorAbandon, tradeStatus.InitiatorConfirmed, tradeStatus.Successful, tradeStatus.Failed],
        },
        status: {type: Number, default: 1, required: true}, //状态 1:显示 2:隐藏
    }, {
        versionKey: false,
        bufferCommands: false,
        toJSON: toJsonOptions
    })

    accountTransferRecordSchema.index({fromAccountId: 1, toAccountId: 1});

    return mongoose.model('account-transfer-records', accountTransferRecordSchema)
}