'use strict'

const uuid = require('node-uuid')
const mongoModels = require('../models/index')

module.exports = app => {

    const {type} = app

    return {

        /**
         * 创建eth账户
         */
        createEthAddress(userId, password) {

            let account = app.ethClient.web3.eth.accounts.create()

            let keystore = account.encrypt(password)

            let objectKey = `keystore/${uuid.v4().replace(/-/g, '')}`

            return app.upload.putBuffer(objectKey, new Buffer(JSON.stringify(keystore))).then(data => {
                return mongoModels.ethKeyStore.create({
                    address: account.address,
                    keyStoreUrl: data.url,
                    userId, objectKey,
                    status: 1
                })
            })
        },

        /**
         * 获取eth地址信息
         * @param condition
         */
        getEthAddress(condition) {

            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.ethKeyStore.findOne(condition)
        },

        /**
         * 更新eth地址信息
         * @param conditon
         * @param model
         * @returns {Promise<never>}
         */
        updateEthAddress(model, condition) {

            if (!type.object(model)) {
                return Promise.reject(new Error("model must be object"))
            }

            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.ethKeyStore.update(condition, model)
        },


        /**
         * 查询数量
         * @param condition
         */
        count(condition) {
            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.ethKeyStore.count(condition)
        },

    }
}