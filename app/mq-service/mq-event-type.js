'use strict'

module.exports = {

    /**
     * 支付服务
     */
    payService: {

        /**
         * 为合同支付
         */
        payForContract: {
            routingKey: 'pay.payment.contract',
            eventName: 'paymentContractEvent'
        }
    }
}