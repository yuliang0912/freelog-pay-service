'use strict'

const Controller = require('egg').Controller
const CurrencyTypes = Object.values(require('../../enum/currency-type'))
const {ArgumentError, ApplicationError} = require('egg-freelog-base/error')

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
        const cardAlias = ctx.checkBody('cardAlias').exist().notEmpty().len(2, 50).value
        const currencyType = ctx.checkBody('currencyType').exist().toInt().in(CurrencyTypes).value

        ctx.validate()
        const userId = ctx.request.userId

        var bankName = currencyType === 1 ? ctx.gettext('bank-name') : ctx.gettext('eth-bank-name')
        if (currencyType === 1 && !ctx.app.ethClient.web3.utils.isAddress(cardNo)) {
            throw new ArgumentError(ctx.gettext('params-format-validate-failed', 'cardNo'))
        }

        await this.outsideBankAccountProvider.findOneAndUpdate({
            userId, currencyType, cardNo
        }, {cardAlias, status: 1}, {new: true}).then(model => {
            return model || this.outsideBankAccountProvider.create({
                cardNo, currencyType, cardAlias, bankName, cardType: 1,
                userId: ctx.request.userId,
            })
        }).then(ctx.success)
    }

    /**
     * 删除银行卡
     * @param ctx
     * @returns {Promise<void>}
     */
    async destroy(ctx) {

        const cardNo = ctx.checkParams('id').exist().notEmpty().value
        ctx.validate()

        await this.outsideBankAccountProvider.findOne({cardNo}).then(model => ctx.entityNullValueAndUserAuthorizationCheck(model, {
            msg: ctx.gettext('params-validate-failed', 'cardNo')
        }))

        await this.outsideBankAccountProvider.updateOne({cardNo}, {status: 2})
            .then(data => ctx.success(true))
    }
}