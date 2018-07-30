/**
 * 以太坊事件处理的区块编号记录
 */

'use strict'

module.exports = app => {

    const mongoose = app.mongoose

    const accountSchema = new mongoose.Schema({
        seqId: {type: Number, unique: true, require: true},
        blockNumber: {type: Number, require: true}
    }, {
        versionKey: false,
        bufferCommands: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    return mongoose.model('eth-transfer-block-num', accountSchema)
}