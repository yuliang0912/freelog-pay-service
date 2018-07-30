/**
 * 账户自身信息安全操作
 */

'use strict'

const lodash = require('lodash')
const signKey = 'freelog#account#security#hamac#key'
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')
const signAccountFields = ['accountId', 'accountType', 'ownerId', 'currencyType', 'balance', 'freezeBalance', 'password', 'status']

module.exports = class AccountInfoSecurity {

    /**
     * 签名账户信息
     * 后期可以修改成私钥加密,公钥校验
     * @param accountInfo
     * @returns {*}
     */
    accountInfoSignature(accountInfo) {

        const signString = this._generateEncryptString(accountInfo)
        const signatureValue = accountInfo.signature = crypto.hmacSha1(signString, signKey)

        return signatureValue
    }

    /**
     * 校验账户签名信息是否正确
     * @param accountInfo
     */
    accountSignVerify(accountInfo) {

        const signString = this._generateEncryptString(accountInfo)
        const signatureValue = crypto.hmacSha1(signString, signKey)

        return signatureValue === accountInfo.signature
    }

    /**
     * 根据账户信息生成加密字符串
     * @param accountInfo
     * @returns {*|string}
     * @private
     */
    _generateEncryptString(accountInfo) {

        const signModel = lodash.pick(accountInfo, signAccountFields)
        const signModelKeys = Object.keys(signModel).sort()

        if (signModelKeys.length !== signAccountFields.length) {
            throw new Error('账户信息不全,缺少加密用的必要字段')
        }

        const signString = signModelKeys.reduce((acc, field) => `${acc}_${field}:${signModel[field]}`, 'account_sign_string')

        return crypto.md5(signString)
    }
}