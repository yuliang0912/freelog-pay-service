'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class AccountTransferRecordProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.AccountTransferRecord)
    }
}
