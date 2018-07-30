'use strict'

const Service = require('egg').Service
const accountType = require('../enum/account-type')
const {accountInfoSecurity} = require('../account-service/account-security/index')
const {accountPasswordGenerator, accountIdGenerator} = require('../account-service/generate-account-info/index')

module.exports = class AccountService extends Service {

    constructor({app}) {
        super(...arguments)
        this.accountProvider = app.dal.accountProvider
        this.accountPendTradeProvider = app.dal.accountPendTradeProvider
    }

    /**
     * 创建普通个人交易账户
     * @param currencyType 货币类型
     * @param password 密码
     */
    async createIndividualAccount({accountName, currencyType, password}) {

        const {ctx, config} = this
        const ownerId = ctx.request.userId

        await this.accountProvider.count({currencyType, ownerId}).then(count => {
            count >= config.transactionAccountCountLimit && ctx.error({msg: `当前用户的${currencyType}类型账户数量已经达到上限,无法创建`})
        })
        const accountId = accountIdGenerator.generateAccountId(currencyType)
        const encryptedPasswordInfo = accountPasswordGenerator.generatePasswordInfo(accountId, ownerId, password)
        const accountModel = {
            accountId, ownerId, currencyType,
            accountType: accountType.IndividualAccount,
            accountName: accountName || '我的账户',
            balance: 0.00,
            freezeBalance: 0.00,
            pwSalt: encryptedPasswordInfo.pwSalt,
            password: encryptedPasswordInfo.encryptedPassword,
            status: 1
        }

        this._signAccountInfo(accountModel)

        return this.accountProvider.create(accountModel)
    }

    /**
     * 更新账户信息
     * @param accountId 账户ID
     * @param accountName 账户名
     * @param originalPassword 原始密码
     * @param newPassword 新密码
     * @returns {Promise<void>}
     */
    async updateAccountInfo({accountId, accountName, originalPassword, newPassword, status}) {

        const {ctx} = this
        const ownerId = ctx.request.userId

        const accountInfo = await this.accountProvider.findOne({accountId, ownerId})
        if (!accountInfo || accountInfo.status !== 1) {
            ctx.error({msg: '账户信息或者状态不正确'})
        }
        if (!accountInfoSecurity.accountSignVerify(accountInfo)) {
            ctx.error({msg: '账号数据异常,请联系客服'})
        }
        if (accountName) {
            accountInfo.accountName = accountName
        }
        if (status) {
            accountInfo.status = status
        }

        this._updateTransactionPassword({accountInfo, originalPassword, newPassword})
        this._signAccountInfo(accountInfo)

        const updateModel = {
            accountName: accountInfo.accountName,
            pwSalt: accountInfo.pwSalt,
            password: accountInfo.password,
            signature: accountInfo.signature,
            status: accountInfo.status
        }

        return this.accountProvider.update({accountId}, updateModel)
    }

    /**
     * 签名账户信息
     * @param accountInfo
     * @returns {*}
     * @private
     */
    _signAccountInfo(...args) {
        args.length && args.forEach(accountInfo => accountInfoSecurity.accountInfoSignature(accountInfo))
        return args.length > 0
    }

    /**
     * 更新账户交易密码
     * @param accountInfo
     * @param originalPassword
     * @param newPassword
     * @private
     */
    _updateTransactionPassword({accountInfo, originalPassword, newPassword}) {

        const {ctx} = this
        if (!originalPassword && !newPassword) {
            return
        }
        if (!originalPassword || !newPassword) {
            ctx.error({msg: '参数originalPassword和newPassword不全', data: {originalPassword, newPassword}})
        }

        const {accountId, ownerId, password, pwSalt} = accountInfo
        const verifyParams = {
            accountId, ownerId, originalPassword, pwSalt, encryptedPassword: password
        }
        this._verifyTransferPassword(verifyParams)
        const encryptedPasswordInfo = accountPasswordGenerator.generatePasswordInfo(accountId, ownerId, newPassword)

        accountInfo.pwSalt = encryptedPasswordInfo.pwSalt
        accountInfo.password = encryptedPasswordInfo.encryptedPassword

        return accountInfo
    }

    /**
     * 校验密码
     * @param accountId
     * @param ownerId
     * @param originalPassword
     * @param pwSalt
     * @param encryptedPassword
     * @private
     */
    _verifyTransferPassword({accountId, ownerId, originalPassword, pwSalt, encryptedPassword}) {

        const {ctx} = this
        if (!accountPasswordGenerator.verifyTransferPassword(...arguments)) {
            ctx.error({msg: '原始交易密码不正确'})
        }
        return true
    }
}