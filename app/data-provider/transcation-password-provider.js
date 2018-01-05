'use strict'


const mongoModels = require('../models/index')
const transcationPasswordHelper = require('../extend/helper/transcation-password-helper')

module.exports = app => {

    const {type} = app

    return {

        /**
         * 新增交易处理记录
         * @param model
         * @returns {*}
         */
        create(model) {

            if (!type.object(model)) {
                return Promise.reject(new Error("model must be object"))
            }

            let passwordInfo = transcationPasswordHelper.generatePassword(model.userId, model.password)

            model = Object.assign(model, passwordInfo)

            return mongoModels.transcationPassword.create(model)
        },


        /**
         * 更新交易密码
         * @param userId
         * @param newPassword
         * @returns {Promise<never>}
         */
        updateTranscationPassword(userId, newPassword) {

            if (!type.string(newPassword) || newPassword.length < 6) {
                return Promise.reject(new Error("newPassword must be string"))
            }


            let passwordInfo = transcationPasswordHelper.generatePassword(userId, newPassword)


            return mongoModels.transcationPassword.update({userId}, passwordInfo).exec()
        },

        /**
         * 查询数量
         * @param condition
         */
        count(condition) {
            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.transcationPassword.count(condition)
        },


        /**
         * 获取交易密码
         * @param condtion
         */
        getTranscationPassword(condition) {

            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return mongoModels.transcationPassword.findOne(condition).exec()
        }
    }
}