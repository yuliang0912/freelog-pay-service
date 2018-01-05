'use strict'

const accountHelper = require('../../extend/helper/account-generate-helper')
const commonRegex = require('egg-freelog-base/app/extend/helper/common_regex')
const transcationPasswordHelper = require('../../extend/helper/transcation-password-helper')

module.exports = app => {

    const dataProvider = app.dataProvider

    return class PayController extends app.Controller {

        /**
         * 订单列表
         * @param ctx
         * @returns {Promise<void>}
         */
        async index(ctx) {
            let page = ctx.checkQuery("page").default(1).gt(0).toInt().value
            let pageSize = ctx.checkQuery("pageSize").default(10).gt(0).lt(101).toInt().value
            let orderType = ctx.checkQuery("orderType").default(1).toInt().in([1]).value
            let accountType = ctx.checkQuery("accountType").optional().toInt().in([1, 2, 3, 4]).value

            ctx.validate()

            let condition = {
                ['sendAccountInfo.userId']: ctx.request.userId
            }
            if (orderType) {
                condition.orderType = orderType
            }
            if (accountType) {
                condition['sendAccountInfo.accountType'] = accountType
            }

            await dataProvider.payOrderProvider.getPayOrderPageList(condition, null, page, pageSize).then(orderList => {
                ctx.success(orderList)
            }).catch(err => ctx.error(err))
        }

        /**
         * 为合同支付
         * @param ctx
         */
        async create(ctx) {

            let targetId = ctx.checkBody('targetId').isContractId().value
            let orderType = ctx.checkBody('orderType').toInt().in([1]).value
            let fromAccountId = ctx.checkBody('fromAccountId').match(accountHelper.verify, '账户格式错误').value
            let toAccountId = ctx.checkBody('toAccountId').match(accountHelper.verify, '账户格式错误').value
            let amount = ctx.checkBody('amount').toInt().gt(0).value
            let password = ctx.checkBody('password').exist().notBlank().trim().len(6, 50).value

            ctx.allowContentType({type: 'json'}).validate()

            let accountInfo = {}
            await dataProvider.accountProvider.getAccountList({
                accountId: {$in: [toAccountId, fromAccountId]}
            }).each(item => {
                accountInfo[item.accountId] = item
            })

            if (!Reflect.has(accountInfo, fromAccountId) || accountInfo[fromAccountId].userId != ctx.request.userId) {
                ctx.error({msg: `未找到用户账号${fromAccountId}`})
            }
            if (!Reflect.has(accountInfo, toAccountId)) {
                ctx.error({msg: `未找到用户账号${toAccountId}`})
            }
            if (accountInfo[toAccountId].accountType !== accountInfo[fromAccountId].accountType) {
                ctx.error({msg: `源账户与目标账户类型不一致,无法执行交易操作`})
            }
            if (accountInfo[fromAccountId].status !== 1) {
                ctx.error({msg: `源账户状态异常,status:${accountInfo[fromAccountId].status}`})
            }
            if (accountInfo[toAccountId].status !== 1) {
                ctx.error({msg: `目标账户状态异常,status:${accountInfo[toAccountId].status}`})
            }

            if (accountInfo[fromAccountId].accountType !== 1) {
                ctx.error({msg: `目前仅支持eth账户支付`})
            }

            let passwordInfo = await dataProvider.transcationPasswordProvider.getTranscationPassword({userId: ctx.request.userId})
            if (!passwordInfo) {
                ctx.error({msg: '还未创建交易密码,不能执行支付操作'})
            }

            let verifyModel = {
                userId: passwordInfo.userId,
                password: passwordInfo.password,
                salt: passwordInfo.salt,
                originalPassword: password
            }

            if (!transcationPasswordHelper.verifyPassword(verifyModel)) {
                ctx.error({msg: '支付错误错误'})
            }

            let contractExecEventCheck = await ctx.curlFromClient(`${this.config.gatewayUrl}/client/v1/contracts/isCanExecEvent?contractId=${targetId}&eventId=transaction_${toAccountId}_${amount}_event`).catch(err => {
                ctx.error(err)
            })

            if (!contractExecEventCheck.isCanExec) {
                ctx.error({msg: '合同不允许执行支付事件,请检查合同状态', data: contractExecEventCheck.contractInfo})
            }

            let payOrderInfo = {
                targetId, orderType, amount,
                sendAccountInfo: accountInfo[fromAccountId],
                receiveAccountInfo: accountInfo[toAccountId]
            }

            await ctx.service.payService.ethPay(payOrderInfo).then(orderInfo => {
                ctx.success(orderInfo)
            }).catch(err => ctx.error(err))
        }

        /**
         * 查看订单信息
         * @param ctx
         * @returns {Promise<void>}
         */
        async show(ctx) {

            let id = ctx.checkParams("id").exist().len(24, 70).value

            ctx.validate()

            let condition = {}
            if (commonRegex.mongoObjectId.test(id)) {
                condition._id = id
            }
            else if (/^0x[a-fA-F0-9]{0,70}$/.test(id)) {
                condition.transferId = id
            }
            else {
                ctx.error({msg: 'id格式不正确:' + id})
            }

            await dataProvider.payOrderProvider.getModel(condition).exec()
                .bind(ctx).then(ctx.success).catch(ctx.error)
        }

        /**
         * 以太坊上的交易原始信息
         * @param ctx
         * @returns {Promise<void>}
         */
        async ethTransactionReceipt(ctx) {

            let transactionId = ctx.checkParams("transactionId").exist().len(24, 70).value

            ctx.validate()

            let transaction = await app.ethClient.web3.eth.getTransaction(transactionId).catch(ctx.error)

            ctx.success(transaction)
        }
    }
}
