'use strict'

const uuid = require('uuid')
const queue = require('async/queue')
const tradeTypeEnum = require('../../enum/trade-type')
const {accountTradeRecordSecurity} = require('../../account-service/account-security/index')

module.exports = class AccountChangedEventHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.accountAmountChangedEventHandler.bind(this), 3)
        this.accountTradeRecordProvider = app.dal.accountTradeRecordProvider
    }

    /**
     * 事件处理函数
     */
    handler() {
        this.queue.push(...arguments, this.callback.bind(this))
    }

    /**
     * 账户金额变动事件处理函数
     * @param accountInfo
     */
    async accountAmountChangedEventHandler(args) {

        const {accountId, beforeBalance, afterBalance, amount, tradeType, tradePoundage, userId, remark} = args

        const tradeRecordInfo = {
            tradeId: uuid.v4().replace(/-/g, ''),
            accountId, beforeBalance, afterBalance, tradeType, amount, tradePoundage,
            status: 1,
            operationUserId: userId,
            remark: remark || '暂无',
            summary: this.generateSummary(args),
            createDate: new Date().toISOString()
        }
        accountTradeRecordSecurity.accountTradeRecordSignature(tradeRecordInfo)
        //流水记录后期可以考虑在其他地方单独记录,例如账户收到款项处理完以后,发送消息到MQ.
        await this.accountTradeRecordProvider.create(tradeRecordInfo)
    }

    /**
     * 生成系统交易摘要
     * @param correlativeAccountId
     * @param tradeType
     */
    generateSummary({correlativeAccountId, correlativeTradeId, tradeType, amount}) {

        const accountName = amount > 0 ? '付款方' : '收款方'

        switch (tradeType) {
            case tradeTypeEnum.Transfer:
                return `转账,${accountName}:${correlativeAccountId}`
            case tradeTypeEnum.Recharge:
                return `充值,卡号:${correlativeAccountId},银行交易号:${correlativeTradeId}`
            case tradeTypeEnum.Payment:
                return `支付订单,${accountName}:${correlativeAccountId},订单号:${correlativeTradeId}`
            default:
                return '未知'
        }
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("amount-changed-event-handler", '事件执行异常', error)
            this.app.logger.error("amount-changed-event-handler", '事件执行异常', error)
        }
    }
}