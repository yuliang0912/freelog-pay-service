'use strict'

const Patrun = require('patrun')
const IPayment = require('../payment-interface')
const EthereumPayment = require('./ethereum/index')
const currencyType = require('../../enum/currency-type')

class PaymentFactory {

    constructor() {
        this.patrun = this.__initialPaymentImpl__()
    }

    /**
     * 初始化不同货币的支付实现
     * @private
     */
    __initialPaymentImpl__() {

        const patrun = Patrun()

        patrun.add({currencyType: currencyType.ETH}, new EthereumPayment())

        return patrun
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

module.exports = new PaymentFactory()
