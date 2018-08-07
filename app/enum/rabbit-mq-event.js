'use strict'

module.exports = {

    /**
     * 支付外部订单事件
     */
    PaymentOutsideOrder: {
        routingKey: 'event.payment.order',
        eventName: 'outsideOrderPaymentEvent'
    }
}