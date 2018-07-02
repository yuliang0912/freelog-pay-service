'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class TransferHandleProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.TransferHandle)
        this.app = app
    }

    /**
     * 新增交易处理记录
     * @param model
     * @returns {*}
     */
    addTransferHandleRecord(model) {
        return super.create(model)
    }


    //更新交易处理记录
    updateTransferHandleRecord(model, condition) {
        return super.update(condition, model)
    }
}