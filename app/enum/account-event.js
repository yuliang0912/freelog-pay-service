'use strict'

module.exports = {

    /**
     * 账户数据签名校验失败异常
     */
    accountSignatureVerifyFailedEvent: Symbol('account#signatureVerifyFailedEvent'),

    /**
     * 转账
     */
    accountTransferEvent: Symbol('account#transferEvent'),

    /**
     * 支付事件
     */
    accountPaymentEvent: Symbol('account#paymentEvent'),

    /**
     * 账户金额变更事件
     */
    accountAmountChangedEvent: Symbol('account#amountChangedEvent'),

    /**
     * 充值到账事件
     */
    accountRechargeCompletedEvent: Symbol('account#rechargeCompletedEvent'),

    /**
     * 发起询问支付事件
     */
    emitInquirePaymentEvent: Symbol('account#emitInquirePaymentEvent')
}