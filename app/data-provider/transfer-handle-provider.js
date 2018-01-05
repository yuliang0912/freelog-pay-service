'use strict'

const mongoModels = require('../models/index')

module.exports = app => {

    const {type} = app

    return {

        /**
         * 新增交易处理记录
         * @param model
         * @returns {*}
         */
        addTransferHandleRecord(model) {

            if (!type.object(model)) {
                return Promise.reject(new Error("model must be object"))
            }

            return mongoModels.transferHandleRecord.create(model)
        },


        //更新交易处理记录
        updateTransferHandleRecord(model, condition) {

            if (!type.object(model)) {
                return Promise.reject(new Error("model must be object"))
            }

            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.transferHandleRecord.update(condition, model)
        }
    }
}