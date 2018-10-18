'use strict'

const {tradeType, tradeStatus, accountEvent} = require('../../enum/index')
const {PaymentOrderTradeStatusChanged} = require('../../enum/rabbit-mq-event')

module.exports = class AccountPaymentEventHandler {

    constructor(app) {
        this.app = app
        this.paymentOrderProvider = app.dal.paymentOrderProvider
    }

    /**
     * 事件处理函数
     */
    async handler() {
        return this.accountPaymentEventHandler(...arguments)
    }

    /**
     * 支付订单成功事件
     */
    async accountPaymentEventHandler({fromAccountInfo, toAccountInfo, paymentOrderInfo}) {

        if (!paymentOrderInfo || paymentOrderInfo.tradeStatus !== tradeStatus.Successful) {
            console.log('错误的事件触发,请排查系统BUG', paymentOrderInfo)
            return
        }

        const {amount, operationUserId, paymentOrderId, remark} = paymentOrderInfo

        this.sendAccountAmountChangedEvent({
            amount, userId: operationUserId, remark, accountInfo: toAccountInfo,
            tradeDesc: paymentOrderInfo.outsideTradeDesc,
            correlativeInfo: {
                transactionId: paymentOrderId, accountInfo: fromAccountInfo
            }
        })

        this.sendAccountAmountChangedEvent({
            userId: operationUserId, remark, accountInfo: fromAccountInfo, amount: amount * -1,
            tradeDesc: paymentOrderInfo.outsideTradeDesc,
            correlativeInfo: {
                transactionId: paymentOrderId, accountInfo: toAccountInfo
            }
        })

        this.app.rabbitClient.publish(Object.assign({}, PaymentOrderTradeStatusChanged, {body: paymentOrderInfo}))

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