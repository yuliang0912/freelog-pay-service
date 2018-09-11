'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class EthTransferBlockNumProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.EthTransferBlockNum)
    }

    /**
     * 设置最新处理过的区块ID
     * @param blockNum
     */
    async setBlockNumber(blockNumber) {
        if (blockNumber < 1) {
            return
        }
        return super.update({seqId: 1, blockNumber: {$lt: blockNumber}}, {blockNumber})
    }

    /**
     * 获取最新的区块数
     * @returns {*}
     */
    getLatestBlockNumber() {
        return super.findOne({seqId: 1})
    }

    /**
     * 初始化以太坊区块同步数量
     * @returns {Promise<*>}
     */
    async initBlockInfo() {

        const blockInfo = await this.getLatestBlockNumber()

        if (!blockInfo) {
            return super.create({seqId: 1, blockNumber: 1})
        }

        return blockInfo
    }
}