'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class OutsideBankAccountProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.OutsideBankAccount)
    }

    /**
     * 添加银行卡号
     * @param model
     * @returns {model}
     */
    create(model) {
        return super.findOneAndUpdate({cardNo: model.cardNo}, {status: 1}).then(oldInfo => {
            return oldInfo ? Object.assign(oldInfo, {status: 1}) : super.create(model)
        })
    }

}