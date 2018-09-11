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
        return super.findOneAndUpdate({cardNo: model.cardNo}, {status: 1}, {new: true}).then(bankAccount => {
            return bankAccount ? bankAccount : super.create(model)
        })
    }
}