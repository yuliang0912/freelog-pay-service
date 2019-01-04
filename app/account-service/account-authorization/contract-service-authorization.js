'use strict'

const globalInfo = require('egg-freelog-base/globalInfo')

module.exports = class ContractServiceAuthorization {

    /**
     * 身份授权模式
     */
    async authorization({accountInfo, userId, transferType, amount, tradeType}) {

        const {app} = globalInfo

        return app.curlIntranetApi(`${app.webApi.contractInfo}/contractAccount/authorization`, {
            type: 'post',
            contentType: 'json',
            data: {
                amount, tradeType, transferType,
                operationUserId: userId,
                contractId: accountInfo.ownerId,
                accountId: accountInfo.accountId
            }
        }, {userInfo: {userId}})
    }
}