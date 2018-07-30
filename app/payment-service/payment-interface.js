'use strict'

module.exports = class IPayment {

    constructor({currencyType}) {
        this.currencyType = currencyType
    }

    /**
     * 支付接口
     * @param fromCardNo
     * @param toCardNo
     * @param amount
     * @param password
     */
    async payment({fromCardNo, toCardNo, amount, password}) {
        throw new Error("method not implement")
    }

    /**
     * tap接口,不支持的货币不重写即可
     * @returns {Promise<void>}
     */
    async tap(cardNo) {
        throw new Error("method not implement")
    }

    /**
     * 充值(充值到平台的对应币种的托管账户)
     * @param fromCardNo
     * @param amount
     * @param password
     * @returns {Promise<void>}
     */
    async recharge({fromCardNo, amount, password}) {
        throw new Error("method not implement")
    }
}