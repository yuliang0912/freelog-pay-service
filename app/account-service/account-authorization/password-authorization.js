'use strict'

const {accountPasswordGenerator} = require('../generate-account-info/index')

module.exports = class PasswordAuthorization {

    /**
     * 密码授权模式
     * @param accountInfo
     * @param userId
     * @param password
     * @param amount
     * @param tradeType
     * @returns {boolean}
     */
    authorization({accountInfo, userId, password, amount, tradeType}) {

        const verifyParams = {
            accountId: accountInfo.accountId,
            ownerId: accountInfo.ownerId,
            originalPassword: password,
            encryptedPassword: accountInfo.password,
            pwSalt: accountInfo.pwSalt
        }

        return accountPasswordGenerator.verifyTransferPassword(verifyParams)
    }
}