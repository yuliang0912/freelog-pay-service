/**
 * 账户支付订单
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

    const accountSchema = new mongoose.Schema({
        paymentOrderId: {type: String, unique: true, required: true},
        accountId: {type: String, required: true}, //账户ID
        toAccountId: {type: String, required: true}, //收款ID
        paymentType: {type: Number, default: 1, required: true}, //支付类型(1:合同)
        amount: {type: Number, min: 1, required: true}, //支付金额
        tradePoundage: {type: Number, min: 0, default: 0, required: true}, //交易手续费
        operationUserId: {type: Number, default: 0, required: true}, //发起者用户ID
        remark: {type: String, default: '', required: false}, //备注,摘要
        outsideTradeNo: {type: String, unique: true, required: true}, //外部交易号,外部订单号.
        signature: {type: String, required: true}, //签名信息
        status: {type: Number, default: 0, required: true}, //状态 0:临时 1:正常 2:隐藏
    }, {
        versionKey: false,
        bufferCommands: false,
        toJSON: toJsonOptions,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    accountSchema.index({paymentOrderId: 1, accountId: 1, outsideTradeNo: 1});

    return mongoose.model('payment-orders', accountSchema)
}