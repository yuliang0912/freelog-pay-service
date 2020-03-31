'use strict'

const Patrun = require('patrun')
const IPayment = require('../payment-interface')
const EthereumPayment = require('./ethereum/index')
const CurrencyType = require('../../enum/currency-type')
const {ApplicationError} = require('egg-freelog-base/error')

module.exports = class PaymentFactory {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
    }

    /**
     * 获取不同币种的支付实现类
     * @param currencyType
     */
    getProvider(currencyType) {

        let givenProvider = null
        if (currencyType === CurrencyType.ETH) {
            givenProvider = new EthereumPayment(app)
        }
        if (!givenProvider || !givenProvider instanceof IPayment) {
            throw new ApplicationError(this.app.ctx.gettext('code-not-implement-exception'))
        }
        return givenProvider
    }
}

