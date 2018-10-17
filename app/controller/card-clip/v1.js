'use strict'

const Controller = require('egg').Controller
const CurrencyTypes = Object.values(require('../../enum/currency-type'))

module.exports = class CardClipController extends Controller {

    constructor({app}) {
        super(...arguments)
        this.outsideBankAccountProvider = app.dal.outsideBankAccountProvider
    }

    /**
     * 我的所有银行卡(包含以太坊地址)
     * @param ctx
     * @returns {Promise<void>}
     */
    async index(ctx) {

        const currencyType = ctx.checkQuery('currencyType').optional().toInt().in(CurrencyTypes).value
        ctx.validate()

        const condition = {userId: ctx.request.userId, status: 1}
        if (currencyType) {
            condition.currencyType = currencyType
        }

        await this.outsideBankAccountProvider.find(condition).then(ctx.success).catch(ctx.error)
    }

    /**
     * 添加银行卡到我的卡夹
     * @param ctx
     * @returns {Promise<void>}
     */
    async create(ctx) {

        const cardNo = ctx.checkBody('cardNo').exist().notEmpty().value
        const currencyType = ctx.checkBody('currencyType').exist().toInt().in(CurrencyTypes).value

        ctx.validate()
        const userId = ctx.request.userId

        const cardInfo = await ctx.dal.outsideBankAccountProvider.findOne({userId, currencyType, cardNo})
        if (cardInfo) {
            return ctx.success(cardInfo)
        }

        await ctx.dal.outsideBankAccountProvider.create({
            cardNo, currencyType,
            cardType: 1,
            userId: ctx.request.userId,
            bankName: 'default',
        }).then(ctx.success).catch(ctx.error)
    }

    /**
     * 删除银行卡
     * @param ctx
     * @returns {Promise<void>}
     */
    async destroy(ctx) {

        const cardNo = ctx.checkParams('id').exist().notEmpty().value
        ctx.validate()

        const cardInfo = await this.outsideBankAccountProvider.findOne({cardNo})
        if (!cardInfo || cardInfo.userId !== ctx.request.userId) {
            ctx.error({msg: '卡号错误,没有找到有效卡片信息'})
        }

        await this.outsideBankAccountProvider.updateOne({cardNo}, {status: 2})
            .then(data => ctx.success(true)).catch(ctx.error)
    }
}