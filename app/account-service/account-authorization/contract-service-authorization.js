'use strict'

const globalInfo = require('egg-freelog-base/globalInfo')

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
    async authorization({accountInfo, userId, password, amount, tradeType}) {

        const {app} = globalInfo

        const authResult = await app.curl(`${app.webApi.contractInfo}/contractAccount/authorization`, {
            type: 'post',
            contentType: 'json',
            data: {
                amount, tradeType,
                operationUserId: userId,
                contractId: accountInfo.ownerId,
                accountId: accountInfo.accountId
            }
        })

        return authResult

    }
}