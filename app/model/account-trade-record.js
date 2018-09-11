/**
 * 账户交易记录(流水,账单)
 */

'use strict'

const lodash = require('lodash')
const omitFields = ['_id', 'signature']

module.exports = app => {

    const mongoose = app.mongoose

    const toJsonOptions = {
        transform(doc, ret, options) {
            return lodash.omit(ret, omitFields)
        }
    }

    const accountTradeRecordSchema = new mongoose.Schema({
        tradeId: {type: String, unique: true, required: true},
        tradeDesc: {type: String, required: true}, //交易说明
        accountId: {type: String, required: true}, //来源账户
        beforeBalance: {type: Number, required: true}, //账户变动前余额
        afterBalance: {type: Number, required: true}, //账户变动后余额
        tradeType: {type: Number, required: true}, //交易类型(充值,转账,支付等)
        amount: {type: Number, required: true}, //变动金额
        tradePoundage: {type: Number, default: 0, required: true}, //交易手续费
        operationUserId: {type: Number, default: 0, required: true}, //发起者用户ID
        remark: {type: String, required: true}, //用户备注
        summary: {type: String, required: true}, //系统摘要
        signature: {type: String, required: true}, //签名信息
        status: {type: Number, default: 1, required: true}, //状态 1:正常 2:隐藏
        correlativeInfo: {
            accountId: {type: String, required: true},
            accountType: {type: Number, required: true},
            transactionId: {type: String, required: true},
            ownerId: {type: String, required: true},
        },
        createDate: {type: Date, default: Date.now, required: true}
    }, {
        versionKey: false,
        bufferCommands: false,
        toJSON: toJsonOptions
    })

    accountTradeRecordSchema.index({fromAccountId: 1, toAccountId: 1, tradeType: 1});

    return mongoose.model('account-trade-records', accountTradeRecordSchema)
}