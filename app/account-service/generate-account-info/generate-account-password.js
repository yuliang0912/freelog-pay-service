'use strict'

const uuid = require('node-uuid')
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')

module.exports = class GenerateAccountPassword {

    /**
     * 生成加密密码
     * @param userId
     * @param password
     * @returns {*}
     */
    generatePasswordInfo(accountId, ownerId, password) {

        if (!/^\d{6}$/.test(password)) {
            throw new Error('交易密码必须是6位数字')
        }

        const pwSalt = `${uuid.v4()}${uuid.v4()}`.replace(/-/g, '')
        const encryptedPassword = crypto.hmacSha1(this._generateEncryptString({accountId, ownerId, password}), pwSalt)

        return {pwSalt, encryptedPassword, originalPassword: password}
    }

    /**
     * 校验密码
     * @param accountId 账户ID
     * @param ownerId  账户所有者ID
     * @param originalPassword  未加密的原始密码
     * @param encryptedPassword 加密之后的密码
     * @param pwSalt  加密盐值
     * @returns {boolean}
     */
    verifyTransferPassword({accountId, ownerId, originalPassword, encryptedPassword, pwSalt}) {
        return crypto.hmacSha1(this._generateEncryptString({
            accountId,
            ownerId,
            password: originalPassword
        }), pwSalt) === encryptedPassword
    }

    /**
     * 生成加密字符串
     * @param accountId
     * @param ownerId
     * @param password
     * @returns {string}
     * @private
     */
    _generateEncryptString({accountId, ownerId, password}) {
        return `transaction-password@${accountId}-${ownerId}-${password}`
    }
}