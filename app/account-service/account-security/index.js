'use strict'

const AccountInfoSecurity = require('./account-info-security')
const TradeRecordSecurity = require('./trade-record-security')
const PaymentOrderSecurity = require('./payment-order-security')

module.exports = {

    /**
     * 账户自身信息安全
     */
    accountInfoSecurity: new AccountInfoSecurity(),

    /**
     * 账户交易记录安全
     */
    accountTradeRecordSecurity: new TradeRecordSecurity(),

    /**
     * 支付订单安全
     */
    paymentOrderSecurity: new PaymentOrderSecurity()
}