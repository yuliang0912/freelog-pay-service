'use strict'

const globalInfo = require('egg-freelog-base/globalInfo')
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')

//合同服务签名授权
module.exports = class ContractServiceSignAuthorization {

    /**
     * 签名授权模式
     */
    async authorization({accountInfo, userId, amount, password, tradeType, transferType = 1}) {


        const signObject = {
            accountId: accountInfo.accountId, transferType, userId, tradeType
        }
        if (transferType === 1) {
            signObject.amount = amount
        }

        const {contractServiceAuth} = globalInfo.app.config.RasSha256Key
        const signString = Object.keys(signObject).sort().map(x => `${x}=${signObject[x]}`).join('&')

        return crypto.rsaSha256Verify(signString, password, contractServiceAuth.publicKey)
    }
}