'use strict'

const accountGenerate = require('../extend/helper/account-generate-helper')
const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class AccountProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.Account)
        this.app = app
    }

    /**
     * 创建账户
     * @param model
     * @returns {Promise<never>}
     */
    async createAccount(model) {

        const {type, ethClient} = this.app

        if (!type.object(model)) {
            return Promise.reject(new Error("model must be object"))
        }

        if (model.accountType === 1 && !ethClient.web3.utils.isAddress(model.cardNo)) {
            return Promise.reject(new Error("cardNo must be eth address"))
        }

        var flag = true
        var accountId = null

        while (flag) {
            accountId = accountGenerate.generateAccount(model.accountType)
            flag = await super.count({accountId})
        }

        return super.create({
            accountId: accountId,
            accountType: model.accountType,
            userId: model.userId,
            balance: 0,
            status: 1,
            cardNo: model.cardNo
        })
    }

    /**
     * 获取账户列表
     * @param condition
     * @returns {Promise<*>}
     */
    getAccountList(condition) {
        return super.find(condition)
    }

    /**
     * 获取账户
     * @param condition
     * @returns {*}
     */
    getAccount(condition) {
        return super.findOne(condition)
    }

    /**
     * 更新账户信息
     * @param model
     * @param condition
     * @returns {Promise<never>}
     */
    updateAccount(model, condition) {
        return super.update(condition, model)
    }
}
