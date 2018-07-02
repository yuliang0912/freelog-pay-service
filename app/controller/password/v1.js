'use strict'

const Controller = require('egg').Controller
const transcationPasswordHelper = require('../../extend/helper/transcation-password-helper')

module.exports = class PasswordController extends Controller {

    /**
     * 创建支付密码
     * @param ctx
     * @returns {Promise<void>}
     */
    async create(ctx) {

        const password = ctx.checkBody('password').len(6, 50).value

        ctx.allowContentType({type: 'json'}).validate()

        const {transcationPasswordProvider} = ctx.dal

        await transcationPasswordProvider.count({userId: ctx.request.userId}).then(count => {
            count && ctx.error({msg: '不能重复创建支付密码'})
        })
        await transcationPasswordProvider.create({
            userId: ctx.request.userId, password
        }).then(() => ctx.success(true)).catch(ctx.error)
    }


    /**
     * 更新密码
     * @param ctx
     * @returns {Promise<void>}
     */
    async update(ctx) {

        const userId = ctx.checkParams("id").toInt().value;
        const oldPassword = ctx.checkBody('oldPassword').exist().notBlank().trim().len(6, 50).value
        const newPassword = ctx.checkBody('newPassword').exist().notBlank().trim().len(6, 50).value

        ctx.allowContentType({type: 'json'}).validate()

        if (userId !== ctx.request.userId) {
            ctx.error({msg: '参数userId与登陆用户不匹配'})
        }
        if (oldPassword === newPassword) {
            ctx.error({msg: '新旧密码不能一致'})
        }

        const {transcationPasswordProvider} = ctx.dal

        const passwordInfo = await transcationPasswordProvider.getTranscationPassword({userId})
        if (!passwordInfo) {
            ctx.error({msg: '还未创建交易密码,不能执行更新操作'})
        }

        const verifyModel = {
            userId: passwordInfo.userId,
            password: passwordInfo.password,
            salt: passwordInfo.salt,
            originalPassword: oldPassword
        }

        if (!transcationPasswordHelper.verifyPassword(verifyModel)) {
            ctx.error({msg: '原密码错误'})
        }

        await transcationPasswordProvider.updateTranscationPassword(passwordInfo.userId, newPassword)
            .then(ret => ctx.success(ret.nModified > 0)).catch(ctx.error)
    }
}