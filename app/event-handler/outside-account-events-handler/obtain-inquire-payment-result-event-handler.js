'use strict'

const lodash = require('lodash')
const {accountEvent, tradeStatus} = require('../../enum/index')
const {PaymentOrderTradeStatusChanged} = require('../../enum/rabbit-mq-event')
const {accountInfoSecurity, paymentOrderSecurity} = require('../../account-service/account-security/index')
/**
 * 获取到询问支付结果事件处理(得到确认函的结果)
 */
module.exports = class ObtainInquirePaymentResultEventHandler {

    constructor(app) {
        this.app = app
        this.accountProvider = app.dal.accountProvider
        this.paymentOrderProvider = app.dal.paymentOrderProvider
    }

    /**
     * 询问结果之后确定是否执行支付行为
     * @param paymentOrderId 支付订单号
     * @param inquireResult 询问支付确认结果
     * @returns {Promise<void>}
     */
    async handler({paymentOrderId, inquireResult}) {

        const {accountProvider, paymentOrderProvider} = this

        const paymentOrderInfo = await paymentOrderProvider.findOne({paymentOrderId})
        if (!paymentOrderInfo || paymentOrderInfo.tradeStatus === tradeStatus.Successful
            || paymentOrderInfo.tradeStatus === tradeStatus.Failed || paymentOrderInfo.tradeStatus === tradeStatus.InitiatorAbandon) {
            return
        }

        const {accountId, toAccountId, amount} = paymentOrderInfo
        const {fromAccountInfo, toAccountInfo} = await accountProvider.find({accountId: {$in: [accountId, toAccountId]}}).then(list => {
            const accountInfo = {}
            list.forEach(item => accountInfo[item.accountId] = item)
            return {fromAccountInfo: accountInfo[accountId], toAccountInfo: accountInfo[toAccountId]}
        })

        if (!inquireResult) {
            const task1 = this.updatePaymentOrderProviderStatus(paymentOrderInfo, tradeStatus.InitiatorAbandon)
            const task2 = this.thawAccountFreeBalance(fromAccountInfo, amount)
            await Promise.all([task1, task2])
            return
        }

        await this.freezeBalanceTransfer({
            fromAccountInfo, toAccountInfo, amount, paymentOrderInfo
        }).then(data => {
            return this.updatePaymentOrderProviderStatus(paymentOrderInfo, tradeStatus.Successful)
        })
    }

    /**
     * 使用冻结金额交易
     */
    async freezeBalanceTransfer({fromAccountInfo, toAccountInfo, amount, paymentOrderInfo}) {

        fromAccountInfo.balance = fromAccountInfo.balance - amount
        fromAccountInfo.freezeBalance = fromAccountInfo.freezeBalance - amount
        toAccountInfo.balance = toAccountInfo.balance + amount

        accountInfoSecurity.accountInfoSignature(fromAccountInfo)
        accountInfoSecurity.accountInfoSignature(toAccountInfo)

        const task1 = toAccountInfo.updateOne(lodash.pick(toAccountInfo, ['balance', 'signature']))
        const task2 = fromAccountInfo.updateOne(lodash.pick(fromAccountInfo, ['balance', 'freezeBalance', 'signature']))

        return Promise.all([task1, task2])
            .then(result => this.app.emit(accountEvent.accountPaymentEvent, {
                fromAccountInfo, toAccountInfo, paymentOrderInfo
            }))
            .catch(error => this.errorHandler(error, ...arguments))
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
     * 更新支付订单状态
     */
    async updatePaymentOrderProviderStatus(paymentOrderInfo, tradeStatus) {

        paymentOrderInfo.tradeStatus = tradeStatus
        paymentOrderSecurity.paymentOrderSignature(paymentOrderInfo)

        const {signature} = paymentOrderInfo

        return paymentOrderInfo.updateOne({tradeStatus, signature})
            .then(() => this.sendMessageToRabbit(paymentOrderInfo))
            .catch(error => this.errorHandler(error, ...arguments))
    }

    /**
     * 发送订单状态变更信息到MQ
     * @param paymentOrderInfo
     */
    sendMessageToRabbit(paymentOrderInfo) {
        if (paymentOrderInfo.tradeStatus === tradeStatus.Successful || paymentOrderInfo.tradeStatus === tradeStatus.Failed) {
            return this.app.rabbitClient.publish(Object.assign({}, PaymentOrderTradeStatusChanged, {body: paymentOrderInfo}))
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