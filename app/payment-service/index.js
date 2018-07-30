/**
 * 支付服务(支持多币种)
 */

'use strict'

const IPayment = require('./payment-interface')
const paymentFactory = require('./payment-impl/index')

module.exports = class PaymentService extends IPayment {

    constructor(currencyType) {
        super(currencyType)
        this.provider = paymentFactory.getProvider(currencyType)
    }

    /**
     * 发起支付
     * @param currencyType 货币类型
     * @param fromCardNo 发起方银行卡号
     * @param toCardNo  接收方银行卡号
     * @param amount 支付金额
     * @param password 支付密码
     * @returns {Promise<*>}
     */
    async payment({fromCardNo, toCardNo, amount, password}) {
        return this.provider.payment(...arguments)
    }

    /**
     * 平台给用户tap币
     * @returns {Promise<void>}
     */
    async tap(cardNo) {
        return this.provider.tap(cardNo)
    }

    /**
     * 充值(充值到平台的对应币种的托管账户)
     * @param fromCardNo
     * @param amount
     * @param password
     * @returns {Promise<void>}
     */
    async recharge({fromCardNo, amount, password}) {
        return this.provider.recharge(...arguments)
    }
}