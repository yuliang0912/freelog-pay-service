'use strict'

module.exports = {

    /**
     * feather交易事件
     */
    featherTransferEvent: Symbol('outsideTrade#featherTransferEvent'),

    /**
     * 获取到外部支付确认结果事件
     */
    obtainInquirePaymentResultEvent: Symbol('outsideTrade#obtainInquirePaymentResultEvent'),

    /**
     * 获取到外部转账确认结果事件
     */
    obtainInquireTransferResultEvent: Symbol('outsideTrade#obtainInquireTransferResultEvent'),
}