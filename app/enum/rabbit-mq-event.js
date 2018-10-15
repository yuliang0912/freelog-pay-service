'use strict'

module.exports = {
    
    /**
     * 支付订单状态变更事件
     */
    PaymentOrderTradeStatusChanged: Object.freeze({
        routingKey: 'event.payment.order',
        eventName: 'PaymentOrderTradeStatusChanged'
    }),

    /**
     * 支付订单状态变更事件
     */
    TransferRecordTradeStatusChanged: Object.freeze({
        routingKey: 'event.payment.order',
        eventName: 'TransferRecordTradeStatusChanged'
    }),

    /**
     * 发起支付确认函(询问发起方)
     */
    EmitInquirePayment: Object.freeze({
        routingKey: 'event.payment.order',
        eventName: 'inquirePaymentEvent'
    }),

    /**
     * 发起转账确认函
     */
    EmitInquireTransfer: Object.freeze({
        routingKey: 'event.payment.order',
        eventName: 'inquireTransferEvent'
    })
}