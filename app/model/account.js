/**
 * 账户主实体
 */

'use strict'

const lodash = require('lodash')
const omitFields = ['_id', 'password', 'signature', 'pwSalt', 'authorizationType']

module.exports = app => {

    const mongoose = app.mongoose

    const toJsonOptions = {
        transform(doc, ret, options) {
            return lodash.omit(ret, omitFields)
        }
    }

    const accountSchema = new mongoose.Schema({
        accountId: {type: String, unique: true, required: true},
        accountName: {type: String, required: true},
        accountType: {type: Number, required: true},
        ownerId: {type: String, required: true}, //所属者ID
        userId: {type: Number, default: 0, required: false}, //用户ID
        currencyType: {type: Number, required: true, enum: [1, 2, 3, 4]}, //货币类型
        balance: {type: Number, default: 0, required: true},
        freezeBalance: {type: Number, default: 0, required: true}, //冻结金额
        authorizationType: {type: Number, default: 1, required: true, enum: [1, 2]},
        password: {type: String, default: '', required: false}, //支付密码(6位数字的加密值)
        pwSalt: {type: String, default: '', required: false},
        signature: {type: String, required: true}, //对账户数据加密
        status: {type: Number, default: 1, required: true}, //状态 1:正常 2:冻结 3:不启用 4:删除  5:交易锁定中
    }, {
        versionKey: false,
        bufferCommands: false,
        toJSON: toJsonOptions,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    accountSchema.index({accountId: 1, ownerId: 1});

    return mongoose.model('accounts', accountSchema)
}