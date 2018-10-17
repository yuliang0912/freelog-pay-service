'use strict'

const {tradeStatus} = require('../../enum/index')
const {EmitInquirePayment} = require('../../enum/rabbit-mq-event')
const {paymentOrderSecurity} = require('../../account-service/account-security/index')

module.exports = class EmitInquirePaymentEventHandler {

    constructor(app) {
        this.app = app
        this.paymentOrderProvider = app.dal.paymentOrderProvider
    }

    /**
     * 发起询问支付事件
     * 设置支付订单状态为支付确认中
     */
    handler(paymentOrderInfo) {
        this.app.rabbitClient.publish(Object.assign({}, EmitInquirePayment, {body: paymentOrderInfo}))
            .then(() => this.updatePaymentOrderTradeStatus(paymentOrderInfo, tradeStatus.InitiatorConfirmed))
            .catch(error => this.callback(error, paymentOrderInfo))
    }

    /**
     * 更新支付订单状态
     */
    updatePaymentOrderTradeStatus(paymentOrderInfo, tradeStatus) {

        paymentOrderInfo.tradeStatus = tradeStatus
        paymentOrderSecurity.paymentOrderSignature(paymentOrderInfo)

        const {paymentOrderId, signature} = paymentOrderInfo

        return this.paymentOrderProvider.updateOne({paymentOrderId, tradeStatus: tradeStatus.Pending}, {
            tradeStatus, signature
        })
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error, paymentOrderInfo) {
        if (error instanceof Error) {
            console.log("emit-inquire-payment-event-handler事件执行异常", error, paymentOrderInfo)
            this.app.logger.error("emit-inquire-payment-event-handler事件执行异常", error, paymentOrderInfo)
        }
    }
}