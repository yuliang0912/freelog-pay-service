'use strict'

const queue = require('async/queue')
const {tradeType, accountEvent} = require('../../enum/index')
const {PaymentOutsideOrder} = require('../../enum/rabbit-mq-event')

module.exports = class AccountPaymentEventHandler {

    constructor(app) {
        this.app = app
        this.paymentOrderProvider = app.dal.paymentOrderProvider
        this.queue = queue(this.accountPaymentEventHandler.bind(this), 3)
    }

    /**
     * 事件处理函数
     */
    handler() {
        this.queue.push(...arguments, this.callback.bind(this))
    }

    /**
     * 账户金额变动事件处理函数
     * @param accountInfo
     */
    async accountPaymentEventHandler(args) {

        const {fromAccountInfo, toAccountInfo, amount, userId, paymentOrderId, remark} = args
        const paymentOrderInfo = await this.paymentOrderProvider.findOne({paymentOrderId})
        if (!paymentOrderInfo || !paymentOrderInfo.isPaymentSuccess) {
            console.log('错误的事件触发,请排查系统BUG', paymentOrderInfo)
            return
        }

        this.sendAccountAmountChangedEvent({
            amount, userId, remark, accountInfo: toAccountInfo,
            tradeDesc: paymentOrderInfo.outsideTradeDesc,
            correlativeInfo: {
                transactionId: paymentOrderId, accountInfo: fromAccountInfo
            }
        })

        this.sendAccountAmountChangedEvent({
            userId, remark, accountInfo: fromAccountInfo, amount: amount * -1,
            tradeDesc: paymentOrderInfo.outsideTradeDesc,
            correlativeInfo: {
                transactionId: paymentOrderId, accountInfo: toAccountInfo
            }
        })

        this.sendPaymentEventToMessageQueue(paymentOrderInfo)

        //此处还需要发送消息给对应的订单方,例如合同订单

        console.log(`支付成功,订单号:${paymentOrderId},外部订单号:${paymentOrderInfo.outsideTradeNo}`)
    }

    /**
     * 发送账户金额变更事件
     * @param accountInfo
     * @param amount
     */
    sendAccountAmountChangedEvent({accountInfo, tradeDesc, amount, userId, remark, correlativeInfo}) {

        const {accountId, balance} = accountInfo
        const accountAmountChangedEventParams = {
            amount, userId, accountId, tradeDesc, correlativeInfo,
            beforeBalance: accountInfo.balance + amount * -1,
            remark: remark || '转账',
            tradePoundage: 0,
            tradeType: tradeType.Payment,
            afterBalance: balance
        }

        this.app.emit(accountEvent.accountAmountChangedEvent, accountAmountChangedEventParams)
    }

    /**
     * 发送支付事件到消息队列
     */
    sendPaymentEventToMessageQueue(paymentOrderInfo) {
        this.app.rabbitClient.publish({
            routingKey: PaymentOutsideOrder.routingKey,
            eventName: PaymentOutsideOrder.eventName,
            body: paymentOrderInfo
        }).catch(error => {
            console.error('支付事件通知MQ失败', paymentOrderInfo, error)
        })
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("payment-event-handler", '事件执行异常', error)
            this.app.logger.error("payment-event-handler", '事件执行异常', error)
        }
    }
}