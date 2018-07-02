'use strict'

const Controller = require('egg').Controller
const accountHelper = require('../../extend/helper/account-generate-helper')
const commonRegex = require('egg-freelog-base/app/extend/helper/common_regex')
const transcationPasswordHelper = require('../../extend/helper/transcation-password-helper')

module.exports = class PayController extends Controller {

    /**
     * 订单列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async index(ctx) {

        const page = ctx.checkQuery("page").default(1).gt(0).toInt().value
        const pageSize = ctx.checkQuery("pageSize").default(10).gt(0).lt(101).toInt().value
        const orderType = ctx.checkQuery("orderType").default(1).toInt().in([1]).value
        const accountType = ctx.checkQuery("accountType").optional().toInt().in([1, 2, 3, 4]).value

        ctx.validate()

        const condition = {
            ['sendAccountInfo.userId']: ctx.request.userId
        }
        if (orderType) {
            condition.orderType = orderType
        }
        if (accountType) {
            condition['sendAccountInfo.accountType'] = accountType
        }

        await ctx.dal.payOrderProvider.getPayOrderPageList(condition, null, page, pageSize).then(ctx.success)
    }

    /**
     * 为合同支付
     * @param ctx
     */
    async create(ctx) {

        const targetId = ctx.checkBody('targetId').isContractId().value
        const orderType = ctx.checkBody('orderType').toInt().in([1]).value
        const fromAccountId = ctx.checkBody('fromAccountId').match(accountHelper.verify, '账户格式错误').value
        const toAccountId = ctx.checkBody('toAccountId').match(accountHelper.verify, '账户格式错误').value
        const amount = ctx.checkBody('amount').toInt().gt(0).value
        const password = ctx.checkBody('password').exist().notBlank().trim().len(6, 50).value

        ctx.allowContentType({type: 'json'}).validate()

        const accountInfo = {}
        await ctx.dal.accountProvider.getAccountList({
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

        const passwordInfo = await ctx.dal.transcationPasswordProvider.getTranscationPassword({userId: ctx.request.userId})
        if (!passwordInfo) {
            ctx.error({msg: '还未创建交易密码,不能执行支付操作'})
        }

        const verifyModel = {
            userId: passwordInfo.userId,
            password: passwordInfo.password,
            salt: passwordInfo.salt,
            originalPassword: password
        }

        if (!transcationPasswordHelper.verifyPassword(verifyModel)) {
            ctx.error({msg: '支付错误错误'})
        }

        const contractExecEventCheck = await ctx.curlFromClient(`${this.config.gatewayUrl}/client/v1/contracts/isCanExecEvent?contractId=${targetId}&eventId=transaction_${toAccountId}_${amount}_event`)
        if (!contractExecEventCheck.isCanExec) {
            ctx.error({msg: '合同不允许执行支付事件,请检查合同状态', data: contractExecEventCheck.contractInfo})
        }

        const payOrderInfo = {
            targetId, orderType, amount,
            sendAccountInfo: accountInfo[fromAccountId],
            receiveAccountInfo: accountInfo[toAccountId]
        }

        await ctx.service.payService.ethPay(payOrderInfo).then(ctx.success).catch(ctx.error)
    }

    /**
     * 查看订单信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async show(ctx) {

        const id = ctx.checkParams("id").exist().len(24, 70).value

        ctx.validate()

        const condition = {}
        if (commonRegex.mongoObjectId.test(id)) {
            condition._id = id
        }
        else if (/^0x[a-fA-F0-9]{0,70}$/.test(id)) {
            condition.transferId = id
        }
        else {
            ctx.error({msg: 'id格式不正确:' + id})
        }

        await ctx.dal.payOrderProvider.findOne(condition).then(ctx.success).catch(ctx.error)
    }


    /**
     * 订单信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async orderInfo(ctx) {

        const orderId = ctx.checkQuery("orderId").optional().isMongoObjectId('orderId格式错误').value
        const transferId = ctx.checkQuery("transferId").optional().len(24, 70).value
        const targetId = ctx.checkQuery("targetId").optional().isContractId().value
        const orderType = ctx.checkQuery("orderType").optional().default(1).toInt().in([1]).value
        ctx.validate()

        const condition = {}
        if (transferId) {
            condition.transferId = transferId
        }
        if (targetId) {
            condition.targetId = targetId
        }
        if (orderId) {
            condition._id = orderId
        }
        if (!Object.keys(condition).length) {
            ctx.error({msg: '参数transferId和targetId最少需要一个'})
        }

        condition.orderType = orderType

        await ctx.dal.payOrderProvider.findOne(condition).then(ctx.success).catch(ctx.error)
    }

    /**
     * 以太坊上的交易原始信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async ethTransactionReceipt(ctx) {

        const transactionId = ctx.checkParams("transactionId").exist().len(24, 70).value

        ctx.validate()

        const transaction = await ctx.app.ethClient.web3.eth.getTransaction(transactionId).catch(ctx.error)

        ctx.success(transaction)
    }
}
