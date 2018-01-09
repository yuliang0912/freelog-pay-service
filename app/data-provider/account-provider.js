'use strict'

const mongoModels = require('../models/index')
const accountGenerate = require('../extend/helper/account-generate-helper')

module.exports = app => {

    const {type} = app

    return {
        /**
         * 创建账户
         * @param model
         * @returns {Promise<never>}
         */
        async createAccount(model) {

            if (!type.object(model)) {
                return Promise.reject(new Error("model must be object"))
            }

            if (model.accountType === 1 && !app.ethClient.web3.utils.isAddress(model.cardNo)) {
                return Promise.reject(new Error("cardNo must be eth address"))
            }

            let flag = true
            let accountId = null

            while (flag) {
                accountId = accountGenerate.generateAccount(model.accountType)
                flag = await mongoModels.account.count({accountId})
            }

            return mongoModels.account.create({
                accountId: accountId,
                accountType: model.accountType,
                userId: model.userId,
                balance: 0,
                status: 1,
                cardNo: model.cardNo
            })
        },

        /**
         * 获取账户列表
         * @param condition
         * @returns {Promise<*>}
         */
        getAccountList(condition) {

            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.account.find(condition).exec()
        },

        /**
         * 获取账户
         * @param condition
         * @returns {*}
         */
        getAccount(condition) {

            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.account.findOne(condition)
        },

        /**
         * 查询数量
         * @param condition
         */
        count(condition) {
            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.account.count(condition)
        },
    }
}