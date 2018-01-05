'use strict'

const mongoose = require('mongoose')

const account = require('./account.model')
const paryOrder = require('./pay.order.model')
const ethKeyStore = require('./account.eth.store.model')
const transferHandleRecord = require('./transfer.handle.model')
const transcationPassword = require('./transaction.password.model')
const featherTransferRecord = require('./feather.transfer.record.model')


module.exports = {

    /**
     * 账户服务
     */
    account,

    /**
     * 支付订单
     */
    paryOrder,

    /**
     * 以太坊账号keystore存储信息
     */
    ethKeyStore,

    /**
     * 飞致币交易记录
     */
    featherTransferRecord,

    /**
     * 交易后续服务器处理记录
     */
    transferHandleRecord,

    /**
     * 支付密码
     */
    transcationPassword,

    /**
     * 自动获取mongoseID
     * @returns {*}
     * @constructor
     */
    get ObjectId() {
        return new mongoose.Types.ObjectId
    }
}