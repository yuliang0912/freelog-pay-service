'use strict'

const uuid = require('node-uuid')
const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class EthProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.AccountEthStore)
        this.app = app
    }

    /**
     * 创建eth账户
     */
    createEthAddress(userId, password) {

        const {ethClient, ossClient} = this.app

        const account = ethClient.web3.eth.accounts.create()

        const keystore = account.encrypt(password)
        const objectKey = `keystore/${uuid.v4().replace(/-/g, '')}`

        return ossClient.putBuffer(objectKey, new Buffer(JSON.stringify(keystore))).then(data => {
            return super.create({
                address: account.address,
                keyStoreUrl: data.url,
                userId, objectKey,
                status: 1
            })
        })
    }

    /**
     * 获取eth地址信息
     * @param condition
     */
    getEthAddress(condition) {
        return super.findOne(condition)
    }

    /**
     * 更新eth地址信息
     * @param conditon
     * @param model
     * @returns {Promise<never>}
     */
    updateEthAddress(model, condition) {
        return super.update(condition, model)
    }
}
