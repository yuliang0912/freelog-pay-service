'use strict'

module.exports = app => {

    const mongoose = app.mongoose

    const accountSchema = new mongoose.Schema({
        accountId: {type: String, unique: true, required: true},
        accountType: {type: Number, required: true},
        userId: {type: Number, required: true}, //创建者ID
        balance: {type: Number, default: 0, required: true},
        status: {type: Number, default: 1, required: true}, //状态 1:正常 2:冻结 3:不启用
        cardNo: {type: String, required: false}
    }, {
        versionKey: false,
        bufferCommands: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    accountSchema.index({nodeId: 1, accountId: 1});

    return mongoose.model('accounts', accountSchema)
}