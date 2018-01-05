'use strict'

const mongoose = require('mongoose')


const TransferHandleRecordSchema = new mongoose.Schema({
    transferId: {type: String, unique: true, required: true},
    transferType: {type: Number, required: true},
    handleInfo: {
        accountFrom: {type: String, required: false, default: ''},
        accountTo: {type: String, required: false, default: ''},
        fromUserId: {type: Number, required: false, default: 0},
        toUserId: {type: Number, required: false, default: 0},
        handleStatus: {type: Number, required: true}, // 0:默认 1:不处理 2:处理成功 3:处理失败
        error: {type: mongoose.Schema.Types.Mixed, default: null}, //不做格式校验,错误信息
        result: {type: mongoose.Schema.Types.Mixed, default: null} //执行结果,不做格式校验
    },
    otherInfo: {}, //其他冗余信息,不做结构限制
    status: {type: Number, default: 0, required: false}  // 1.已知晓  2:正在处理  3:处理完毕  4:处理失败  5:未知的交易
}, {
    versionKey: false,
    bufferCommands: false,
    timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
})

TransferHandleRecordSchema.index({hash: 1, from: 1, to: 1});

module.exports = mongoose.model('transfer-handle-records', TransferHandleRecordSchema)