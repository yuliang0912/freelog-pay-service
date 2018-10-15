/**
 * 处理中的交易(对接真实的币种之间的交易)
 * 交易号由货币对应的支付机构提供
 */

'use strict'

const omitFields = ['_id']
const {tradeStatus} = require('../enum/index')
const lodash = require('lodash')

module.exports = app => {

    const mongoose = app.mongoose

    const toJsonOptions = {
        transform(doc, ret, options) {
            return Object.assign({tradeId: doc.id}, lodash.omit(ret, omitFields))
        }
    }

    const accountPendTradeSchema = new mongoose.Schema({
        accountId: {type: String, required: true}, //关联的平台账户
        outsideTradeId: {type: String, required: true}, //第三方交易平台提供的交易号
        tradeType: {type: Number, default: 1, required: true}, // 交易类型 1:充值
        userId: {type: Number, required: true}, //操作用户ID
        amount: {type: Number, min: 1, required: true}, // 1:交易金额
        currencyType: {type: Number, required: true, enum: [1, 2, 3, 4]}, //货币类型
        cardNo: {type: String, required: true}, //交易卡号
        tradeStatus: {
            type: Number, default: 1, required: true,
            enum: [tradeStatus.Pending, tradeStatus.Successful, tradeStatus.Failed],
        },
        status: {type: Number, default: 1, required: true}, //状态 1:显示 2:隐藏
    }, {
        versionKey: false,
        bufferCommands: false,
        toJSON: toJsonOptions,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    accountPendTradeSchema.index({outsideTradeId: 1, currencyType: 1}, {unique: true});

    accountPendTradeSchema.virtual('tradeId').get(function () {
        return this.id
    })

    return mongoose.model('account-pend-trades', accountPendTradeSchema)
}