'use strict'

const Controller = require('egg').Controller
const {accountType} = require('../../enum/index')

module.exports = class AccountController extends Controller {

    constructor({app}) {
        super(...arguments)
        this.accountProvider = app.dal.accountProvider
        this.accountTradeRecordProvider = app.dal.accountTradeRecordProvider
    }

    /**
     * 我的账户列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async index(ctx) {

        const currencyType = ctx.checkQuery('currencyType').optional().toInt().in([1, 2, 3, 4]).toInt().value
        ctx.validate()

        const condition = {ownerId: ctx.request.userId.toString()}
        if (currencyType) {
            condition.currencyType = currencyType
        }

        await this.accountProvider.find(condition).then(ctx.success).catch(ctx.error)
    }

    /**
     * 获取账户详情
     * @param ctx
     * @returns {Promise<void>}
     */
    async show(ctx) {

        const accountId = ctx.checkParams('id').isTransferAccountId().value

        ctx.validate()

        await this.accountProvider.findOne({accountId, ownerId: ctx.request.userId}).then(ctx.success).catch(ctx.error)
    }

    /**
     * 创建freelog账户
     * @param ctx
     * @returns {Promise<void>}
     */
    async create(ctx) {

        const accountName = ctx.checkBody('accountName').optional().trim().len(2, 10).value
        const currencyType = ctx.checkBody('currencyType').exist().toInt().in([1, 2, 3, 4]).value
        const password = ctx.checkBody('password').exist().isNumeric().len(6, 6).value

        ctx.allowContentType({type: 'json'}).validate()

        await ctx.service.accountService.createIndividualAccount({accountName, currencyType, password})
            .then(ctx.success).catch(ctx.error)
    }

    /**
     * 创建合同账户
     * @param ctx
     * @returns {Promise<void>}
     */
    async createContractAccount(ctx) {

        const contractId = ctx.checkBody('contractId').exist().isContractId().value
        const accountName = ctx.checkBody('accountName').optional().trim().len(2, 10).value
        const currencyType = ctx.checkBody('currencyType').exist().toInt().in([1, 2, 3, 4]).value
        ctx.validate()

        await ctx.service.accountService.createContractAccount({accountName, contractId, currencyType})
            .then(ctx.success).catch(ctx.error)
    }

    /**
     * 更新账户信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async update(ctx) {

        const accountId = ctx.checkParams('id').isTransferAccountId().value
        const accountName = ctx.checkBody('accountName').optional().trim().len(2, 10).value
        const newPassword = ctx.checkBody('newPassword').optional().isNumeric().len(6, 6).value
        const originalPassword = ctx.checkBody('originalPassword').optional().isNumeric().len(6, 6).value
        ctx.allowContentType({type: 'json'}).validate()

        if (accountName === undefined && newPassword === undefined && originalPassword === undefined) {
            ctx.error({msg: '没有有效参数'})
        }

        await ctx.service.accountService.updateAccountInfo({
            accountId, accountName, originalPassword, newPassword
        }).then(data => {
            return data.nModified > 0 ? this.accountProvider.findOne({accountId}) : null
        }).then(ctx.success).catch(ctx.error)
    }

    /**
     * 删除(禁用账户)
     * @param ctx
     * @returns {Promise<void>}
     */
    async destroy(ctx) {

        const accountId = ctx.checkParams('id').isTransferAccountId().value
        ctx.validate()

        const accountInfo = await this.accountProvider.findOne({accountId, ownerId: ctx.request.userId})
        if (!accountInfo) {
            ctx.error({msg: '未找到有效账户信息'})
        }
        if (accountInfo.status === 3) {
            return ctx.success(accountInfo)
        }
        if (accountInfo.status !== 1) {
            ctx.error({msg: '账户状态不正确,无法执行删除操作'})
        }

        await ctx.service.accountService.updateAccountInfo({accountId, status: 3}).then(data => {
            return data.nModified > 0 ? this.accountProvider.findOne({accountId}) : null
        }).then(ctx.success).catch(ctx.error)
    }


    /**
     * 账户流水记录
     * @param ctx
     * @returns {Promise<void>}
     */
    async tradeRecords(ctx) {

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

        const task1 = this.accountTradeRecordProvider.count({accountId})
        const task2 = this.accountTradeRecordProvider.findPageList({accountId}, page, pageSize, null, {createDate: -1})

        await Promise.all([task1, task2]).then(([totalItem, dataList]) => ctx.success({
            page, pageSize, totalItem, dataList
        }))
    }
}