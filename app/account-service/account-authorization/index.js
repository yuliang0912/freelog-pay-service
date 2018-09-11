'use strict'

const Patrun = require('patrun')
const {accountAuthorizationType} = require('../../enum/index')
const PasswordAuthorization = require('./password-authorization')
const IdentityAuthorization = require('./identity-authorization')
const ContractServiceAuthorization = require('./contract-service-authorization')

class AccountAuthorization {

    constructor() {
        this.patrun = Patrun()
        this.__registerAccountAuthorization__()
    }

    /**
     * 合同授权
     * @param accountInfo
     * @param userId
     * @param password
     * @param amount
     * @param tradeType
     */
    async authorization({accountInfo, userId, password, amount, tradeType, outsideTradeNo}) {

        accountInfo.authorizationType = accountInfo.authorizationType || accountAuthorizationType.PasswordAndIdentity

        const authCombinations = this.patrun.find({authType: accountInfo.authorizationType})
        if (!authCombinations) {
            throw new Error(`不支持的账户授权模式,请检查完善代码.authorizationType:${accountInfo.authorizationType}`)
        }

        for (let i = 0, j = authCombinations.length; i < j; i++) {
            const authCombination = authCombinations[i]
            const authHandler = this.patrun.find({authTypeImpl: authCombination.type})
            const authResult = await authHandler.authorization(...arguments)
            if (!authResult) {
                return {authResult: false, message: `${authCombination.name}失败`}
            }
        }

        return {authResult: true, message: 'success'}
    }

    /**
     * 注册授权模式
     * @private
     */
    __registerAccountAuthorization__() {

        const {patrun} = this

        //组合授权模式
        patrun.add({authType: accountAuthorizationType.PasswordAndIdentity}, [
            {type: 'identity', name: '身份授权'},
            {type: 'password', name: '密码授权'},
        ])

        patrun.add({authType: accountAuthorizationType.ContractServiceAuthorization}, [
            {type: 'contract-service', name: '合同服务授权'}
        ])

        //具体授权模式实现
        patrun.add({authTypeImpl: 'password'}, new PasswordAuthorization())
        patrun.add({authTypeImpl: 'identity'}, new IdentityAuthorization())
        patrun.add({authTypeImpl: 'contract-service'}, new ContractServiceAuthorization())
    }
}

module.exports = new AccountAuthorization()