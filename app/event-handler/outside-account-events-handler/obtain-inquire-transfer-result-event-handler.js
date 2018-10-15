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
            const task1 = this.updateTransferRecordTradeStatus(transferRecordInfo, tradeStatus.InitiatorAbandon)
            const task2 = this.thawAccountFreeBalance(fromAccountInfo, amount)
            await Promise.all([task1, task2])
            return
        }

        await this.freezeBalanceTransfer({
            fromAccountInfo, toAccountInfo, transferRecordInfo
        }).then(data => {
            return this.updateTransferRecordTradeStatus(transferRecordInfo, tradeStatus.Successful)
        })
    }

    /**
     * 使用冻结金额交易
     */
    async freezeBalanceTransfer({fromAccountInfo, toAccountInfo, transferRecordInfo}) {

        const {amount} = transferRecordInfo
        fromAccountInfo.balance = fromAccountInfo.balance - amount
        fromAccountInfo.freezeBalance = fromAccountInfo.freezeBalance - amount
        toAccountInfo.balance = toAccountInfo.balance + amount

        accountInfoSecurity.accountInfoSignature(fromAccountInfo)
        accountInfoSecurity.accountInfoSignature(toAccountInfo)

        const task1 = toAccountInfo.updateOne(lodash.pick(toAccountInfo, ['balance', 'signature']))
        const task2 = fromAccountInfo.updateOne(lodash.pick(fromAccountInfo, ['balance', 'freezeBalance', 'signature']))

        return Promise.all([task1, task2]).then(result => this.app.emit(accountEvent.accountTransferEvent, {
            fromAccountInfo, toAccountInfo, transferRecordInfo
        })).catch(error => this.errorHandler(error, ...arguments))
    }

    /**
     * 解冻保证金
     * @param accountInfo
     * @param amount
     * @returns {Promise<void>}
     */
    async thawAccountFreeBalance(accountInfo, amount) {

        accountInfo.freezeBalance = accountInfo.freezeBalance - amount

        accountInfoSecurity.accountInfoSignature(accountInfo)

        return accountInfo.updateOne(lodash.pick(accountInfo, ['freezeBalance', 'signature']))
            .catch(error => this.errorHandler(error, ...arguments))
    }

    /**
     * 更新转账记录交易状态
     */
    updateTransferRecordTradeStatus(transferRecord, tradeStatus) {

        transferRecord.tradeStatus = tradeStatus

        return transferRecord.updateOne({tradeStatus}).then(() => this.sendMessageToRabbit(transferRecord))
            .catch(error => this.errorHandler(error, ...arguments))
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