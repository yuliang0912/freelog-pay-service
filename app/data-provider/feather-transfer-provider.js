'use strict'

const mongoModels = require('../models/index')

module.exports = app => {

    const {type} = app

    return {

        /**
         * 获取交易信息
         * @param condition
         */
        getTransferInfo(condition) {

            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.featherTransferRecord.findOne(condition)
        },

        /**
         * 新增交易信息
         * @param model
         */
        addTransferInfo(model) {

            if (!type.object(model)) {
                return Promise.reject(new Error("model must be object"))
            }

            return mongoModels.featherTransferRecord.create(models)
        },

        /**
         * 批量新增交易信息
         * @param models
         */
        batchAddTransferInfos(models) {

            if (!Array.isArray(models)) {
                return Promise.reject(new Error("models must be array"))
            }

            if (models.length < 1) {
                return Promise.resolve([])
            }

            return mongoModels.featherTransferRecord.insertMany(models)
        },

        /**
         * 获取当前已经处理的最大区块ID
         */
        getMaxBlockNumber() {
            return mongoModels.featherTransferRecord.findOne(null, 'blockInfo.blockNumber').sort({'blockInfo.blockNumber': 'desc'}).limit(1)
        }
    }
}