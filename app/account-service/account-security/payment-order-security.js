/**
 * 支付订单信息安全操作
 */

'use strict'

const lodash = require('lodash')
const signKey = 'freelog#account#payment#order#security#hamac#key'
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')
const signPaymentOrderFields = ['paymentOrderId', 'accountId', 'toAccountId', 'outsideTradeNo', 'paymentType', 'tradePoundage', 'operationUserId', 'paymentStatus', 'amount', 'createDate']

module.exports = class PaymentOrderSecurity {

    /**
     * 签名订单信息
     * 后期可以修改成私钥加密,公钥校验
     * @param paymentOrder
     * @returns {*}
     */
    paymentOrderSignature(paymentOrder) {

        const signString = this._generateEncryptString(paymentOrder)
        const signatureValue = paymentOrder.signature = crypto.hmacSha1(signString, signKey)

        return signatureValue
    }

    /**
     * 校验订单签名信息是否正确
     * @param accountInfo
     */
    paymentOrderSignVerify(paymentOrder) {

        const signString = this._generateEncryptString(paymentOrder)
        const signatureValue = crypto.hmacSha1(signString, signKey)

        return signatureValue === paymentOrder.signature
    }

    /**
     * 根据账户信息生成加密字符串
     * @param accountInfo
     * @returns {*|string}
     * @private
     */
    _generateEncryptString(paymentOrder) {

        const signModel = lodash.pick(paymentOrder, signPaymentOrderFields)
        const signModelKeys = Object.keys(signModel).sort()

        if (signModelKeys.length !== signPaymentOrderFields.length) {
            console.log(signModelKeys, signPaymentOrderFields)
            throw new Error('支付订单信息不全,缺少加密用的必要字段')
        }

        const signString = signModelKeys.reduce((acc, field) => `${acc}_${field}:${signModel[field]}`, 'payment_order_sign_string')

        return crypto.md5(signString)
    }
}