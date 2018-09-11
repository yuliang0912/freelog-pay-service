'use strict'

module.exports = {

    /**
     * 支付外部订单事件
     */
    PaymentOutsideOrder: Object.freeze({
        routingKey: 'event.payment.order',
        eventName: 'outsideOrderPaymentEvent'
    }),

    /**
     * 支付订单状态变更事件
     */
    PaymentOrderStatusChanged: Object.freeze({
        routingKey: 'event.payment.order',
        eventName: 'paymentOrderStatusChangedEvent'
    }),

    /**
     * 发起支付确认函(询问发起方)
     */
    EmitInquirePayment: Object.freeze({
        routingKey: 'event.payment.order',
        eventName: 'inquirePaymentEvent'
    })
}