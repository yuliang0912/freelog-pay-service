/**
 * 卡包(我的银行卡列表)
 */

'use strict'

const lodash = require('lodash')

module.exports = app => {

    const mongoose = app.mongoose

    const toJsonOptions = {
        transform(doc, ret, options) {
            return Object.assign(lodash.omit(ret, ['_id', 'cardType']))
        }
    }

    const accountSchema = new mongoose.Schema({
        cardNo: {type: String, required: true},
        userId: {type: Number, required: true},
        bankName: {type: String, required: true},
        cardAlias: {type: String, required: true}, //别名
        cardType: {type: Number, enum: [1, 2, 3], required: true}, //类型 (1:普通账户 2:储蓄卡  3:信用卡)
        currencyType: {type: Number, required: true},
        status: {type: Number, default: 1, enum: [1, 2], required: true}, //状态 1:正常 2:删除
    }, {
        versionKey: false,
        bufferCommands: false,
        toJSON: toJsonOptions,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    accountSchema.index({userId: 1, currencyType: 1, cardNo: 1}, {unique: true});

    return mongoose.model('card-clips', accountSchema)
}