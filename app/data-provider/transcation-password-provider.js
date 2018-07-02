'use strict'

const transcationPasswordHelper = require('../extend/helper/transcation-password-helper')
const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class TranscationPasswordProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.TransactionPassword)
        this.app = app
    }

    /**
     * 新增交易处理记录
     * @param model
     * @returns {*}
     */
    create(model) {

        if (!this.app.type.object(model)) {
            return Promise.reject(new Error("model must be object"))
        }

        const passwordInfo = transcationPasswordHelper.generatePassword(model.userId, model.password)
        model = Object.assign(model, passwordInfo)

        return super.create(model)
    }

    /**
     * 更新交易密码
     * @param userId
     * @param newPassword
     * @returns {Promise<never>}
     */
    updateTranscationPassword(userId, newPassword) {

        if (!this.app.type.string(newPassword) || newPassword.length < 6) {
            return Promise.reject(new Error("newPassword must be string"))
        }
        const passwordInfo = transcationPasswordHelper.generatePassword(userId, newPassword)

        return super.update({userId}, passwordInfo)
    }

    /**
     * 获取交易密码
     * @param condtion
     */
    getTranscationPassword(condition) {
        return super.findOne(condition)
    }
}