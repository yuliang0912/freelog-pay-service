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
            await this.fallbackHandle({fromAccountInfo, amount, paymentOrderInfo})
        } else {
            await this.inquireSuccessfulConfirmHandle({fromAccountInfo, toAccountInfo, amount, paymentOrderInfo})
        }
    }

    /**
     * 支付问询确认被拒绝的回退处理
     */
    async fallbackHandle({fromAccountInfo, amount, paymentOrderInfo}) {

        const task1 = this.accountProvider.findOneAndUpdate({accountId: fromAccountInfo.accountId}, {$inc: {freezeBalance: -amount}}, {new: true}).then(accountInfo => {
            accountInfoSecurity.accountInfoSignature(accountInfo)
            return accountInfo.updateOne({signature: accountInfo.signature})
        })

        paymentOrderInfo.tradeStatus = tradeStatus.InitiatorAbandon
        paymentOrderSecurity.paymentOrderSignature(paymentOrderInfo)
        const task2 = paymentOrderInfo.updateOne(lodash.pick(paymentOrderInfo, ['tradeStatus', 'signature']))

        return Promise.all([task1, task2]).then(() => {
            return this.sendMessageToRabbit(paymentOrderInfo)
        }).catch(error => this.errorHandler(error, ...arguments))
    }

    /**
     * 支付问询确认成功处理
     */
    async inquireSuccessfulConfirmHandle({fromAccountInfo, toAccountInfo, amount, paymentOrderInfo}) {

        fromAccountInfo.balance = fromAccountInfo.balance - amount
        fromAccountInfo.freezeBalance = fromAccountInfo.freezeBalance - amount
        toAccountInfo.balance = toAccountInfo.balance + amount
        paymentOrderInfo.tradeStatus = tradeStatus.Successful

        const task1 = this.accountProvider.findOneAndUpdate({accountId: fromAccountInfo.accountId}, {
            $inc: {balance: -amount, freezeBalance: -amount}
        }, {new: true})
        const task2 = this.accountProvider.findOneAndUpdate({accountId: toAccountInfo.accountId}, {$inc: {balance: amount}}, {new: true})

        return Promise.all([task1, task2]).then(([newFromAccountInfo, newToAccountInfo]) => {

            accountInfoSecurity.accountInfoSignature(newToAccountInfo)
            accountInfoSecurity.accountInfoSignature(newFromAccountInfo)
            paymentOrderSecurity.paymentOrderSignature(paymentOrderInfo)

            const task3 = newToAccountInfo.updateOne({signature: newToAccountInfo.signature})
            const task4 = newFromAccountInfo.updateOne({signature: newFromAccountInfo.signature})
            const task5 = paymentOrderInfo.updateOne(lodash.pick(paymentOrderInfo, ['tradeStatus', 'signature']))

            Promise.all([task3, task4, task5]).catch(error => {
                this.errorHandler(error, fromAccountInfo, toAccountInfo, paymentOrderInfo)
            })
            this.app.emit(accountEvent.accountPaymentEvent, {fromAccountInfo, toAccountInfo, paymentOrderInfo})
        }).catch(error => this.errorHandler(error, ...arguments))

        // fromAccountInfo.balance = fromAccountInfo.balance - amount
        // fromAccountInfo.freezeBalance = fromAccountInfo.freezeBalance - amount
        // toAccountInfo.balance = toAccountInfo.balance + amount
        // paymentOrderInfo.tradeStatus = tradeStatus.Successful
        //
        // accountInfoSecurity.accountInfoSignature(toAccountInfo)
        // accountInfoSecurity.accountInfoSignature(fromAccountInfo)
        // paymentOrderSecurity.paymentOrderSignature(paymentOrderInfo)
        //
        // const task1 = toAccountInfo.updateOne(lodash.pick(toAccountInfo, ['balance', 'signature']))
        // const task2 = fromAccountInfo.updateOne(lodash.pick(fromAccountInfo, ['balance', 'freezeBalance', 'signature']))
        // const task3 = paymentOrderInfo.updateOne(lodash.pick(paymentOrderInfo, ['tradeStatus', 'signature']))
        //
        // return Promise.all([task1, task2, task3]).then(() => {
        //     this.app.emit(accountEvent.accountPaymentEvent, {fromAccountInfo, toAccountInfo, paymentOrderInfo})
        //     return this.sendMessageToRabbit(paymentOrderInfo)
        // }).catch(error => this.errorHandler(error, ...arguments))
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