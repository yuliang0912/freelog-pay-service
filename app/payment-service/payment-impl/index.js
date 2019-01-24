'use strict'

const Patrun = require('patrun')
const IPayment = require('../payment-interface')
const EthereumPayment = require('./ethereum/index')
const currencyType = require('../../enum/currency-type')

module.exports = class PaymentFactory {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.__initialPaymentImpl__()
    }

    /**
     * 初始化不同货币的支付实现
     * @private
     */
    __initialPaymentImpl__() {

        const {app, patrun} = this

        patrun.add({currencyType: currencyType.ETH}, new EthereumPayment(app))
    }

    /**
     * 获取不同币种的支付实现类
     * @param currencyType
     */
    getProvider(currencyType) {

        const givenProvider = this.patrun.find({currencyType})

        if (!givenProvider || !givenProvider instanceof IPayment) {
            throw new Error(`不支持的货币类型:${currencyType}`)
        }

        return givenProvider
    }
}

