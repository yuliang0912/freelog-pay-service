'use strict'

const lodash = require('lodash')
const {accountEvent, tradeStatus} = require('../../enum/index')
const {TransferRecordTradeStatusChanged} = require('../../enum/rabbit-mq-event')
const {accountInfoSecurity} = require('../../account-service/account-security/index')

/**
 * 获取到询问转账结果事件处理(得到确认函的结果)
 */
module.exports = class ObtainInquireTransferResultEventHandler {

    constructor(app) {
        this.app = app
        this.accountProvider = app.dal.accountProvider
        this.accountTransferRecordProvider = app.dal.accountTransferRecordProvider
    }

    /**
     * 询问结果之后确定是否执行转账行为
     * @param paymentOrderId 转账交易号
     * @param inquireResult 询问支付确认结果
     * @returns {Promise<void>}
     */
    async handler({transferId, inquireResult}) {

        const {accountProvider, accountTransferRecordProvider} = this
        const transferRecordInfo = await accountTransferRecordProvider.findOne({transferId})

        if (!transferRecordInfo || transferRecordInfo.tradeStatus === tradeStatus.Successful
            || transferRecordInfo.tradeStatus === tradeStatus.Failed || transferRecordInfo.tradeStatus === tradeStatus.InitiatorAbandon) {
            return
        }

        const {fromAccountId, toAccountId, amount} = transferRecordInfo
        const {fromAccountInfo, toAccountInfo} = await accountProvider.find({accountId: {$in: [fromAccountId, toAccountId]}}).then(list => {
            const accountInfo = {}
            list.forEach(item => accountInfo[item.accountId] = item)
            return {fromAccountInfo: accountInfo[fromAccountId], toAccountInfo: accountInfo[toAccountId]}
        })

        if (!inquireResult) {
            await this.fallbackHandle({fromAccountInfo, amount, transferRecordInfo})
        } else {
            await this.inquireSuccessfulConfirmHandle({fromAccountInfo, toAccountInfo, amount, transferRecordInfo})
        }
    }

    /**
     * 转账问询确认被拒绝的回退处理
     */
    async fallbackHandle({fromAccountInfo, amount, transferRecordInfo}) {

        fromAccountInfo.freezeBalance = fromAccountInfo.freezeBalance - amount
        accountInfoSecurity.accountInfoSignature(fromAccountInfo)

        transferRecordInfo.tradeStatus = tradeStatus.InitiatorAbandon

        const task1 = transferRecordInfo.updateOne({tradeStatus: tradeStatus.InitiatorAbandon})
        const task2 = fromAccountInfo.updateOne(lodash.pick(fromAccountInfo, ['freezeBalance', 'signature']))

        return Promise.all([task1, task2]).then(() => {
            return this.sendMessageToRabbit(transferRecordInfo)
        }).catch(error => this.errorHandler(error, ...arguments))
    }

    /**
     * 支付问询确认成功处理
     */
    async inquireSuccessfulConfirmHandle({fromAccountInfo, toAccountInfo, amount, transferRecordInfo}) {

        fromAccountInfo.balance = fromAccountInfo.balance - amount
        fromAccountInfo.freezeBalance = fromAccountInfo.freezeBalance - amount
        toAccountInfo.balance = toAccountInfo.balance + amount
        transferRecordInfo.tradeStatus = tradeStatus.Successful

        accountInfoSecurity.accountInfoSignature(fromAccountInfo)
        accountInfoSecurity.accountInfoSignature(toAccountInfo)

        const task1 = toAccountInfo.updateOne(lodash.pick(toAccountInfo, ['balance', 'signature']))
        const task2 = fromAccountInfo.updateOne(lodash.pick(fromAccountInfo, ['balance', 'freezeBalance', 'signature']))
        const task3 = transferRecordInfo.updateOne({tradeStatus: tradeStatus.Successful})

        return Promise.all([task1, task2, task3]).then(() => {
            this.app.emit(accountEvent.accountTransferEvent, {fromAccountInfo, toAccountInfo, transferRecordInfo})
            return this.sendMessageToRabbit(transferRecordInfo)
        }).catch(error => this.errorHandler(error, ...arguments))
    }

    /**
     * 发送订单状态变更信息到MQ
     * @param paymentOrderInfo
     */
    sendMessageToRabbit(transferRecord) {
        if (transferRecord.tradeStatus === tradeStatus.Successful || transferRecord.tradeStatus === tradeStatus.Failed) {
            return this.app.rabbitClient.publish(Object.assign({}, TransferRecordTradeStatusChanged, {body: transferRecord}))
        }
    }

    /**
     * 错误处理
     * @param err
     */
    errorHandler(error, ...args) {
        if (error instanceof Error) {
            console.log("obtain-inquire-payment-result-event-handler事件执行异常", error, ...arguments)
            this.app.logger.error("obtain-inquire-payment-result-event-handler事件执行异常", error, ...arguments)
        }
    }
}