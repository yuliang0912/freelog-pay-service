'use strict'

const uuid = require('uuid')
const queue = require('async/queue')
const tradeTypeEnum = require('../../enum/trade-type')
const {accountTradeRecordSecurity} = require('../../account-service/account-security/index')

module.exports = class AccountChangedEventHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.accountAmountChangedEventHandler.bind(this), 30)
        this.accountTradeRecordProvider = app.dal.accountTradeRecordProvider
    }

    /**
     * 事件处理函数
     */
    async handler() {
        this.queue.push(...arguments, this.callback.bind(this))
    }

    /**
     * 账户金额变动事件处理函数
     */
    async accountAmountChangedEventHandler(args) {

        const {tradeDesc, accountId, correlativeInfo, beforeBalance, afterBalance, amount, tradeType, tradePoundage, userId, remark} = args

        const tradeRecordInfo = {
            tradeId: uuid.v4().replace(/-/g, ''),
            accountId, beforeBalance, afterBalance, tradeType, amount, tradePoundage, tradeDesc,
            status: 1,
            operationUserId: userId,
            remark: remark || '暂无',
            summary: this.generateSummary(args),
            createDate: new Date().toISOString()
        }

        tradeRecordInfo.correlativeInfo = {
            transactionId: correlativeInfo.transactionId,
            accountId: correlativeInfo.accountInfo.accountId,
            accountType: correlativeInfo.accountInfo.accountType,
            ownerId: correlativeInfo.accountInfo.ownerId
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
    generateSummary({correlativeInfo, tradeType, amount}) {

        const accountName = amount > 0 ? '付款方' : '收款方'
        const {accountInfo, transactionId} = correlativeInfo

        switch (tradeType) {
            case tradeTypeEnum.Transfer:
                return `转账,${accountName}:${accountInfo.accountId},记录号:${transactionId}`
            case tradeTypeEnum.Recharge:
                return `充值,记录号:${transactionId}`
            case tradeTypeEnum.Payment:
                return `支付订单,${accountName}:${accountInfo.accountId},订单号:${transactionId}`
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