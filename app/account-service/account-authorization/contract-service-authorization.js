'use strict'

module.exports = class ContractServiceAuthorization {

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

        console.log('未实现的合同服务授权方式')

        return true

    }
}