'use strict'

module.exports = class IdentityAuthorization {

    /**
     * 身份授权模式
     * @param accountInfo
     * @param userId
     * @param password
     * @param amount
     * @param tradeType
     * @returns {boolean}
     */
    authorization({accountInfo, userId, password, amount, tradeType}) {
        return accountInfo.ownerId === userId.toString()
    }
}