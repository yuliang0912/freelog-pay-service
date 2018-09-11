'use strict'

const lodash = require('lodash')
const {accountEvent} = require('../../enum/index')
const {PaymentOrderStatusChanged} = require('../../enum/rabbit-mq-event')
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
        if (!paymentOrderInfo || paymentOrderInfo.paymentStatus !== 2) {
            return
        }

        const {accountId, toAccountId, amount, paymentType, outsideTradeNo, remark, operationUserId} = paymentOrderInfo
        const {fromAccountInfo, toAccountInfo} = await accountProvider.find({accountId: {$in: [accountId, toAccountId]}}).then(list => {
            const accountInfo = {}
            list.forEach(item => accountInfo[item.accountId] = item)
            return {fromAccountInfo: accountInfo[accountId], toAccountInfo: accountInfo[toAccountId]}
        })

        if (!inquireResult) {
            const task1 = this.updatePaymentOrderProviderStatus(paymentOrderInfo, 5)
            const task2 = this.thawAccountFreeBalance(fromAccountInfo, amount)
            await Promise.all([task1, task2])
            return
        }

        await this.freezeBalanceTransfer({
            fromAccountInfo, toAccountInfo, amount,
            paymentType, outsideTradeNo, remark, paymentOrderId, userId: operationUserId
        }).then(data => {
            return this.updatePaymentOrderProviderStatus(paymentOrderInfo, 3)
        })
    }

    /**
     * 使用冻结金额交易
     */
    async freezeBalanceTransfer({fromAccountInfo, toAccountInfo, amount, paymentType, outsideTradeNo, remark, paymentOrderId, userId}) {

        fromAccountInfo.balance = fromAccountInfo.balance - amount
        fromAccountInfo.freezeBalance = fromAccountInfo.freezeBalance - amount
        toAccountInfo.balance = toAccountInfo.balance + amount

        accountInfoSecurity.accountInfoSignature(fromAccountInfo)
        accountInfoSecurity.accountInfoSignature(toAccountInfo)

        const task1 = toAccountInfo.update(lodash.pick(toAccountInfo, ['balance', 'signature']))
        const task2 = fromAccountInfo.update(lodash.pick(fromAccountInfo, ['balance', 'freezeBalance', 'signature']))

        return Promise.all([task1, task2])
            .then(result => this.app.emit(accountEvent.accountPaymentEvent, ...arguments))
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

        return accountInfo.update(lodash.pick(accountInfo, ['freezeBalance', 'signature']))
            .catch(error => this.errorHandler(error, ...arguments))
    }

    /**
     * 更新支付订单状态
     * @param paymentOrderId
     * @param paymentStatus
     */
    updatePaymentOrderProviderStatus(paymentOrderInfo, paymentStatus) {

        paymentOrderInfo.paymentStatus = paymentStatus
        paymentOrderSecurity.paymentOrderSignature(paymentOrderInfo)

        const {signature} = paymentOrderInfo

        return paymentOrderInfo.update({paymentStatus, signature})
            .then(data => this.app.rabbitClient.publish(Object.assign({}, PaymentOrderStatusChanged, {body: paymentOrderInfo})))
            .catch(error => this.errorHandler(error, ...arguments))
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