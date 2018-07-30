/**
 * 卡包(我的银行卡列表)
 */

'use strict'

module.exports = app => {

    const mongoose = app.mongoose

    const accountSchema = new mongoose.Schema({
        cardNo: {type: String, required: true},
        userId: {type: Number, required: true},
        bankName: {type: String, required: true},
        cardType: {type: Number, required: true}, //类型 (1:普通账户 2:储蓄卡  3:信用卡)
        currencyType: {type: Number, required: true},
        status: {type: Number, default: 1, required: true}, //状态 1:正常 2:删除
    }, {
        versionKey: false,
        bufferCommands: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    accountSchema.index({userId: 1, cardNo: 1}, {unique: true});

    return mongoose.model('card-clips', accountSchema)
}