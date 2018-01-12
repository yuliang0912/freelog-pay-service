'use strict'

const mongoose = require('mongoose')


const toObjectOptions = {
    transform: function (doc, ret, options) {
        return {
            orderId: ret._id.toString(),
            transferId: ret.transferId,
            targetId: ret.targetId,
            orderType: ret.orderType,
            payAmount: ret.payAmount,
            sendAccountInfo: ret.sendAccountInfo,
            receiveAccountInfo: ret.receiveAccountInfo,
            status: ret.status,
            createDate: ret.createDate,
        }
    }
}

const PayOrderSchema = new mongoose.Schema({
    transferId: {type: String, required: true, unique: true}, //交易唯一ID
    sendAccountInfo: {
        userId: {type: Number, required: true}, //发起方用户ID
        accountId: {type: String, required: true},  //发起账户
        accountType: {type: Number, required: true},  //发起账户类型
        cardNo: {type: String, required: false}
    },
    receiveAccountInfo: {
        userId: {type: Number, required: true}, //发起方用户ID
        accountId: {type: String, required: true},  //发起账户
        accountType: {type: Number, required: true},  //发起账户类型
        cardNo: {type: String, required: false},
    },
    targetId: {type: String, required: true}, //交易目标ID
    orderType: {type: Number, required: true}, //订单类型
    payAmount: {type: Number, required: true}, //支付金额
    salt: {type: String, required: true}, //交易加密盐值
    transferSign: {
        alg: {type: String, required: true}, //签名算法
        value: {type: String, required: true} //签名结果
    },
    otherInfo: {type: mongoose.Schema.Types.Mixed, default: {}}, //其他参数信息
    status: {type: Number, required: true}, //1:正在发起(pending)  2:已成功(resolve)  3:失败(reject)
}, {
    versionKey: false,
    bufferCommands: false, //与连接的配置一起使用,不缓存命令,如果连接失败,直接报错,不等待重新连接
    toJSON: toObjectOptions,
    toObject: toObjectOptions,
    timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
})

PayOrderSchema.index({userId: 1, transferId: 1});

module.exports = mongoose.model('pay-order', PayOrderSchema)