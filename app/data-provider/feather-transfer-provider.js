'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class FeatherTransferProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.FeatherTransferRecord)
        this.app = app
    }

    /**
     * 获取交易信息
     * @param condition
     */
    getTransferInfo(condition) {
        return super.findOne(condition)
    }

    /**
     * 新增交易信息
     * @param model
     */
    addTransferInfo(model) {
        return super.create(model)
    }

    /**
     * 批量新增交易信息
     * @param models
     */
    batchAddTransferInfos(models) {
        return super.insertMany(models)
    }

    /**
     * 获取当前已经处理的最大区块ID
     */
    getMaxBlockNumber() {
        return super.model.findOne({}, 'blockInfo.blockNumber').sort({'blockInfo.blockNumber': 'desc'}).limit(1)
    }
}