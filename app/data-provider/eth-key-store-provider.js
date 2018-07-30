'use strict'

const uuid = require('node-uuid')
const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class EthKeyStoreProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.EthKeyStore)
        this.app = app
    }

    /**
     * 保存eth地址信息
     * @param model
     */
    async saveEthAddressInfo({ethAddressInfo, userId}) {

        const objectKey = `keystore/${uuid.v4().replace(/-/g, '')}`
        const keyStoreUrl = await this.app.ossClient.putBuffer(objectKey, new Buffer(JSON.stringify(ethAddressInfo.keyStore))).then(data => data.url)

        return super.create({address: ethAddressInfo.address, keyStoreUrl, objectKey, userId})
    }
}
