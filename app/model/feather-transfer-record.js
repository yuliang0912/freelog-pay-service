'use strict'

module.exports = app => {

    const mongoose = app.mongoose

    const FeatherTransferRecordSchema = new mongoose.Schema({
        hash: {type: String, unique: true, required: true},
        from: {type: String, required: true},
        to: {type: String, required: true},
        blockInfo: {},  //保留原始区块信息
        returnValues: {
            from: {type: String, required: true},
            to: {type: String, required: true},
            value: {type: String, required: true},
            data: {type: String, required: false}
        },
        status: {type: Number, default: 0, required: false}
    }, {
        versionKey: false,
        bufferCommands: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    FeatherTransferRecordSchema.index({hash: 1, from: 1, to: 1});

    return mongoose.model('feather-transfer-records', FeatherTransferRecordSchema)
}