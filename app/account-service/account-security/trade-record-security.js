/**
 * 账户交易记录信息安全操作
 */

'use strict'

const lodash = require('lodash')
const signKey = 'freelog#account#trade#record#security#hamac#key'
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')
const signTradeRecordFields = ['tradeId', 'accountId', 'beforeBalance', 'afterBalance', 'tradeType', 'amount', 'tradePoundage', 'operationUserId', 'createDate', 'status']

module.exports = class TradeRecordSecurity {

    /**
     * 签名账户信息
     * 后期可以修改成私钥加密,公钥校验
     * @param accountTradeRecord
     * @returns {*}
     */
    accountTradeRecordSignature(accountTradeRecord) {

        const signString = this._generateEncryptString(accountTradeRecord)
        const signatureValue = accountTradeRecord.signature = crypto.hmacSha1(signString, signKey)

        return signatureValue
    }

    /**
     * 校验账户签名信息是否正确
     * @param accountInfo
     */
    accountSignVerify(accountTradeRecord) {

        const signString = this._generateEncryptString(accountTradeRecord)
        const signatureValue = crypto.hmacSha1(signString, signKey)

        return signatureValue === accountTradeRecord.signature
    }

    /**
     * 根据账户信息生成加密字符串
     * @param accountInfo
     * @returns {*|string}
     * @private
     */
    _generateEncryptString(accountTradeRecord) {

        const signModel = lodash.pick(accountTradeRecord, signTradeRecordFields)
        const signModelKeys = Object.keys(signModel).sort()

        if (signModelKeys.length !== signTradeRecordFields.length) {
            throw new Error('账户交易记录信息不全,缺少加密用的必要字段')
        }

        const signString = signModelKeys.reduce((acc, field) => `${acc}_${field}:${signModel[field]}`, 'trade_record_sign_string')

        return crypto.md5(signString)
    }

}