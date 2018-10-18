'use strict'

const Controller = require('egg').Controller
const {accountType, tradeStatus} = require('../../enum/index')

module.exports = class PayController extends Controller {

    constructor({app}) {
        super(...arguments)
        this.accountProvider = app.dal.accountProvider
        this.paymentOrderProvider = app.dal.paymentOrderProvider
        this.accountPendTradeProvider = app.dal.accountPendTradeProvider
        this.accountTradeRecordProvider = app.dal.accountTradeRecordProvider
    }

    /**
     * 充值
     * @param ctx
     */
    async recharge(ctx) {

        const accountId = ctx.checkBody('accountId').exist().isTransferAccountId().value
        const cardNo = ctx.checkBody('cardNo').exist().notEmpty().value
        const amount = ctx.checkBody('amount').exist().isInt().toInt().gt(0).value

        ctx.validate()

        const accountInfo = await this.accountProvider.findOne({accountId})
        if (!accountInfo) {
            ctx.error({msg: `未找到有效账号信息,请确认账户ID是否正确`, data: {accountInfo}})
        }

        await ctx.service.payService.recharge({accountInfo, cardNo, amount}).then(ctx.success).catch(ctx.error)
    }

    /**
     * 转账
     * @param ctx
     */
    async transfer(ctx) {

        //交易金额,以币种的最小单位为准.例如分,borb
        const amount = ctx.checkBody('amount').exist().isInt().toInt().gt(0).value
        const password = ctx.checkBody('password').optional().isNumeric().len(6, 6).value
        const toAccountId = ctx.checkBody('toAccountId').exist().isTransferAccountId().value
        const fromAccountId = ctx.checkBody('fromAccountId').exist().isTransferAccountId().value
        const remark = ctx.checkBody('remark').optional().type('string').len(1, 200).value
        ctx.validate()

        const accountInfo = {}
        await this.accountProvider.find({accountId: {$in: [toAccountId, fromAccountId]}}).then(list => {
            list.forEach(item => accountInfo[item.accountId] = item)
        })
        const fromAccountInfo = accountInfo[fromAccountId]
        const toAccountInfo = accountInfo[toAccountId]

        if (!fromAccountInfo) {
            ctx.error({msg: `未找到付款方账号${fromAccountId}`})
        }
        if (!toAccountInfo) {
            ctx.error({msg: `未找到收款方用户账号${toAccountId}`})
        }

        const transferRecordInfo = await ctx.service.payService.transfer({
            fromAccountInfo, toAccountInfo, password, amount, remark
        })

        await this.accountProvider.findOne({accountId: fromAccountId}).then(data => {
            ctx.success({transferResult: transferRecordInfo, balance: data.balance})
        })
    }

    /**
     * 支付
     * @param ctx
     */
    async payment(ctx) {

        //交易金额,以币种的最小单位为准.例如分,borb
        const amount = ctx.checkBody('amount').exist().isInt().toInt().gt(0).value
        const password = ctx.checkBody('password').optional().isNumeric().len(6, 6).value
        const toAccountId = ctx.checkBody('toAccountId').exist().isTransferAccountId().value
        const fromAccountId = ctx.checkBody('fromAccountId').exist().isTransferAccountId().value
        //外部交易号(订单号),必须唯一,不能重复支付
        const outsideTradeNo = ctx.checkBody('outsideTradeNo').exist().len(5, 32).value
        const outsideTradeDesc = ctx.checkBody('outsideTradeDesc').exist().len(1, 100).value
        const remark = ctx.checkBody('remark').optional().type('string').len(1, 200).value
        const paymentType = ctx.checkBody('paymentType').optional().toInt().default(1).value

        ctx.allowContentType({type: 'json'}).validate()

        const {fromAccountInfo, toAccountInfo} = await this.accountProvider.find({accountId: {$in: [fromAccountId, toAccountId]}}).then(list => {
            const accountInfo = {}
            list.forEach(item => accountInfo[item.accountId] = item)
            return {fromAccountInfo: accountInfo[fromAccountId], toAccountInfo: accountInfo[toAccountId]}
        })
        if (!fromAccountInfo) {
            ctx.error({msg: `未找到发起方账号${fromAccountId}`})
        }
        if (!toAccountInfo) {
            ctx.error({msg: `未找到收款方用户账号${toAccountId}`})
        }

        const oldOrder = await ctx.dal.paymentOrderProvider.findOne({outsideTradeNo})
        if (oldOrder && oldOrder.tradeStatus !== tradeStatus.Failed) {
            ctx.error({msg: `当前订单号已经支付过,不能重复支付`, data: {outsideTradeNo}})
        }

        await ctx.service.payService.payment({
            fromAccountInfo, toAccountInfo, password, amount, outsideTradeNo, outsideTradeDesc, remark, paymentType
        }).then(ctx.success).catch(ctx.error)
    }

    /**
     * 询问支付(先冻结金额,等待发起方确认后再决定扣款或者解除冻结)
     * @param ctx
     * @returns {Promise<void>}
     */
    async inquirePayment(ctx) {

        //交易金额,以币种的最小单位为准.例如分,borb
        const amount = ctx.checkBody('amount').exist().isInt().toInt().gt(0).value
        const password = ctx.checkBody('password').optional().isNumeric().len(6, 6).value
        const toAccountId = ctx.checkBody('toAccountId').exist().isTransferAccountId().value
        const fromAccountId = ctx.checkBody('fromAccountId').exist().isTransferAccountId().value
        //外部交易号(订单号),必须唯一,不能重复支付
        const outsideTradeNo = ctx.checkBody('outsideTradeNo').exist().len(5, 32).value
        const outsideTradeDesc = ctx.checkBody('outsideTradeDesc').exist().len(1, 100).value
        const remark = ctx.checkBody('remark').optional().type('string').len(1, 200).value
        const paymentType = ctx.checkBody('paymentType').optional().toInt().default(1).value

        ctx.validate()

        const {fromAccountInfo, toAccountInfo} = await this.accountProvider.find({accountId: {$in: [fromAccountId, toAccountId]}}).then(list => {
            const accountInfo = {}
            list.forEach(item => accountInfo[item.accountId] = item)
            return {fromAccountInfo: accountInfo[fromAccountId], toAccountInfo: accountInfo[toAccountId]}
        })
        if (!fromAccountInfo) {
            ctx.error({msg: `未找到发起方账号${fromAccountId}`})
        }
        if (!toAccountInfo) {
            ctx.error({msg: `未找到收款方用户账号${toAccountId}`})
        }

        const oldOrder = await ctx.dal.paymentOrderProvider.findOne({outsideTradeNo})
        if (oldOrder) {
            ctx.error({msg: `当前订单号已经支付过,不能重复支付`, data: {outsideTradeNo}})
        }

        await ctx.service.payService.inquirePayment({
            fromAccountInfo, toAccountInfo, password, amount, paymentType, outsideTradeNo, outsideTradeDesc, remark
        }).then(ctx.success).catch(ctx.error)
    }


    /**
     * 询问转账(先冻结金额,等待发起方确认后再决定扣款或者解除冻结)
     * @param ctx
     */
    async inquireTransfer(ctx) {

        //交易金额,以币种的最小单位为准.例如分,borb
        let amount = ctx.checkBody('amount').optional().toInt().gt(0).value
        //转账类型(1:定额 2:全额度) 定额需要传入交易金额
        const transferType = ctx.checkBody('transferType').default(1).optional().toInt().in([1, 2]).value
        const authCode = ctx.checkBody('authCode').optional().type('string').len(1, 1000).value
        const toAccountId = ctx.checkBody('toAccountId').exist().isTransferAccountId().value
        const fromAccountId = ctx.checkBody('fromAccountId').exist().isTransferAccountId().value
        const remark = ctx.checkBody('remark').optional().type('string').len(1, 200).value
        const refParam = ctx.checkBody('refParam').optional().type('string').len(1, 200).value

        if (transferType === 1 && !amount) {
            ctx.errors.push({amount: '缺少参数amount'})
        }
        ctx.validate()

        const accountInfo = {}
        await this.accountProvider.find({accountId: {$in: [toAccountId, fromAccountId]}}).then(list => {
            list.forEach(item => accountInfo[item.accountId] = item)
        })
        const fromAccountInfo = accountInfo[fromAccountId]
        const toAccountInfo = accountInfo[toAccountId]

        if (!fromAccountInfo) {
            ctx.error({msg: `未找到付款方账号${fromAccountId}`})
        }
        if (!toAccountInfo) {
            ctx.error({msg: `未找到收款方用户账号${toAccountId}`})
        }

        await ctx.service.payService.inquireTransfer({
            fromAccountInfo, toAccountInfo, authCode, amount, remark, transferType, refParam
        }).then(ctx.success).catch(ctx.error)
    }

    /**
     * 给账户初始化一笔feather
     * @returns {Promise<void>}
     */
    async officialTap(ctx) {

        const cardNo = ctx.checkBody('cardNo').exist().value
        const currencyType = ctx.checkBody('currencyType').toInt().exist().value

        ctx.validate()

        await ctx.service.payService.tap({currencyType, cardNo}).then(data => {
            ctx.success({outsideTradeId: data})
        }).catch(ctx.error)
    }

    /**
     * 支付订单列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async paymentOrders(ctx) {

        const page = ctx.checkQuery("page").optional().toInt().gt(0).default(1).value
        const pageSize = ctx.checkQuery("pageSize").optional().toInt().gt(0).lt(101).default(10).value
        const accountId = ctx.checkQuery('accountId').exist().isTransferAccountId().value
        ctx.validate()

        const ownerId = ctx.request.userId.toString()
        const accountInfo = this.accountProvider.findOne({accountId})
        if (!accountInfo) {
            ctx.error({msg: '未找到账户信息'})
        }
        if (accountInfo.accountType === accountType.IndividualAccount && accountInfo.ownerId !== ownerId) {
            ctx.error({msg: '没有查看权限'})
        }
        const condition = {accountId, status: 1}
        const task1 = this.paymentOrderProvider.count(condition)
        const task2 = this.paymentOrderProvider.findPageList(condition, page, pageSize, null, {createDate: -1})

        await Promise.all([task1, task2]).then(([totalItem, dataList]) => ctx.success({
            page, pageSize, totalItem, dataList
        }))
    }

    /**
     * 支付订单详情
     * @param ctx
     * @returns {Promise<void>}
     */
    async paymentOrderInfo(ctx) {

        const paymentOrderId = ctx.checkQuery('paymentOrderId').optional().notEmpty().value
        const outsideTradeNo = ctx.checkQuery('outsideTradeNo').optional().notEmpty().value
        ctx.validate()

        if (paymentOrderId === undefined && outsideTradeNo === undefined) {
            ctx.error({msg: '参数缺失'})
        }
        const condition = {}
        if (paymentOrderId) {
            condition.paymentOrderId = paymentOrderId
        }
        if (outsideTradeNo) {
            condition.outsideTradeNo = outsideTradeNo
        }

        await this.paymentOrderProvider.findOne(condition).then(ctx.success)
    }

    /**
     * 外部交易状态查询
     * @returns {Promise<void>}
     */
    async outsideTradeState(ctx) {

        const outsideTradeId = ctx.checkQuery('outsideTradeId').exist().len(20, 200).value
        const currencyType = ctx.checkQuery('currencyType').exist().toInt().in([1, 2, 3, 4]).value
        ctx.validate()

        const result = await this.accountPendTradeProvider.findOne({outsideTradeId, currencyType})
        if (!result) {
            ctx.error({msg: '未找到有效的交易信息'})
        }

        ctx.success(result)
    }
}
