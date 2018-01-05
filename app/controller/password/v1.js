'use strict'

const transcationPasswordHelper = require('../../extend/helper/transcation-password-helper')

module.exports = app => {

    const dataProvider = app.dataProvider

    return class PasswordController extends app.Controller {

        /**
         * 创建支付密码
         * @param ctx
         * @returns {Promise<void>}
         */
        async create(ctx) {

            let password = ctx.checkBody('password').len(6, 50).value

            ctx.allowContentType({type: 'json'}).validate()

            await dataProvider.transcationPasswordProvider.count({userId: ctx.request.userId}).then(count => {
                count && ctx.error({msg: '不能重复创建支付密码'})
            })

            await dataProvider.transcationPasswordProvider.create({
                userId: ctx.request.userId, password
            }).bind(ctx).then(() => {
                ctx.success(true)
            }).catch(ctx.error)
        }


        /**
         * 更新密码
         * @param ctx
         * @returns {Promise<void>}
         */
        async update(ctx) {

            let userId = ctx.checkParams("id").toInt().value;
            let oldPassword = ctx.checkBody('oldPassword').exist().notBlank().trim().len(6, 50).value
            let newPassword = ctx.checkBody('newPassword').exist().notBlank().trim().len(6, 50).value

            ctx.allowContentType({type: 'json'}).validate()

            if (userId !== ctx.request.userId) {
                ctx.error({msg: '参数userId与登陆用户不匹配'})
            }

            if (oldPassword === newPassword) {
                ctx.error({msg: '新旧密码不能一致'})
            }

            let passwordInfo = await dataProvider.transcationPasswordProvider.getTranscationPassword({userId})

            if (!passwordInfo) {
                ctx.error({msg: '还未创建交易密码,不能执行更新操作'})
            }

            let verifyModel = {
                userId: passwordInfo.userId,
                password: passwordInfo.password,
                salt: passwordInfo.salt,
                originalPassword: oldPassword
            }

            if (!transcationPasswordHelper.verifyPassword(verifyModel)) {
                ctx.error({msg: '原密码错误'})
            }

            await dataProvider.transcationPasswordProvider.updateTranscationPassword(passwordInfo.userId, newPassword).bind(ctx)
                .then(ret => {
                    ctx.success(ret.nModified > 0)
                }).catch(ctx.error)
        }
    }
}