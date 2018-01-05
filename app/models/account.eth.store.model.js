/**
 * Created by yuliang on 2017/12/18.
 */

'use strict'

const mongoose = require('mongoose')

const ethKeyStoreSchema = new mongoose.Schema({
    address: {type: String, unique: true, required: true},
    keyStoreUrl: {type: String, required: true},
    objectKey: {type: String, required: true},
    userId: {type: Number, required: true}, //创建者ID
    status: {type: Number, default: 1, required: true} //状态 1:系统存储 2:用户已清除keyStore
}, {
    versionKey: false,
    bufferCommands: false,
    timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
})

ethKeyStoreSchema.index({nodeId: 1, address: 1});

module.exports = mongoose.model('eth-key-stores', ethKeyStoreSchema)