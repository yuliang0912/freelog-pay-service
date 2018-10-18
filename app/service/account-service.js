'use strict'

const Service = require('egg').Service
const {ApplicationError} = require('egg-freelog-base/error')
const {accountType, accountAuthorizationType} = require('../enum/index')
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
            if (count >= config.transactionAccountCountLimit) {
                throw ApplicationError('当前用户的此类型账户数量已经达到上限,无法创建', {limit: config.transactionAccountCountLimit})
            }
        })
        const accountId = accountIdGenerator.generateAccountId({
            currencyType, accountType: accountType.IndividualAccount
        })
        const encryptedPasswordInfo = accountPasswordGenerator.generatePasswordInfo(accountId, ownerId, password)
        const accountModel = {
            accountId, ownerId, currencyType,
            userId: ownerId,
            status: 1,
            balance: 0,
            freezeBalance: 0,
            pwSalt: encryptedPasswordInfo.pwSalt,
            accountName: accountName || '我的账户',
            accountType: accountType.IndividualAccount,
            password: encryptedPasswordInfo.encryptedPassword,
            authorizationType: accountAuthorizationType.PasswordAndIdentity
        }

        this._signAccountInfo(accountModel)

        return this.accountProvider.create(accountModel)
    }

    /**
     * 创建合同交易账户
     * @param currencyType 货币类型
     */
    async createContractAccount({accountName, contractId, currencyType}) {

        const accountId = accountIdGenerator.generateAccountId({currencyType, accountType: accountType.ContractAccount})
        const accountModel = {
            accountId, currencyType,
            userId: 0, status: 1, balance: 0, pwSalt: '', password: '',
            freezeBalance: 0, ownerId: contractId,
            accountName: accountName || '合同账户',
            accountType: accountType.ContractAccount,
            authorizationType: accountAuthorizationType.ContractServiceAuthorization
        }

        this._signAccountInfo(accountModel)

        return this.accountProvider.create(accountModel)
    }

    /**
     * 创建节点交易账户
     * @param currencyType 货币类型
     * @param password 密码
     */
    async createNodeAccount({accountName, currencyType, password, nodeId}) {

        const {ctx, config} = this
        const userId = ctx.request.userId

        await this.accountProvider.count({currencyType, ownerId: nodeId}).then(count => {
            if (count >= config.transactionAccountCountLimit) {
                throw ApplicationError('当前用户的此类型账户数量已经达到上限,无法创建', {limit: config.transactionAccountCountLimit})
            }
        })
        const accountId = accountIdGenerator.generateAccountId({
            currencyType, accountType: accountType.NodeAccount
        })
        const encryptedPasswordInfo = accountPasswordGenerator.generatePasswordInfo(accountId, nodeId, password)
        const accountModel = {
            accountId, currencyType, userId,
            ownerId: nodeId,
            status: 1,
            balance: 0,
            freezeBalance: 0,
            pwSalt: encryptedPasswordInfo.pwSalt,
            accountName: accountName || '我的账户',
            accountType: accountType.IndividualAccount,
            password: encryptedPasswordInfo.encryptedPassword,
            authorizationType: accountAuthorizationType.PasswordAndIdentity
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
            throw ApplicationError('账户信息或者状态不正确', {status: accountInfo ? -100 : accountInfo.status})
        }
        if (!accountInfoSecurity.accountSignVerify(accountInfo)) {
            throw ApplicationError('账号数据异常,请联系客服')
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

        return this.accountProvider.updateOne({accountId}, updateModel)
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

        if (!originalPassword && !newPassword) {
            return
        }
        if (!originalPassword || !newPassword) {
            throw new ApplicationError('参数originalPassword和newPassword不全', {originalPassword, newPassword})
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
        if (!accountPasswordGenerator.verifyTransferPassword(...arguments)) {
            throw new ApplicationError('原始交易密码不正确')
        }
        return true
    }
}