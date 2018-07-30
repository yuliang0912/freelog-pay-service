'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class AccountTradeRecordProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.AccountTradeRecord)
    }

    /**
     * 获取账户交易流水记录
     * @param condition
     * @param page
     * @param pageSize
     * @returns {*}
     */
    getTradeRecords(condition, page, pageSize) {
        return super.findPageList(condition, page, pageSize)
    }
}