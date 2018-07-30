'use strict'

const uuid = require('uuid')
const queue = require('async/queue')
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
            remark: remark || '未知',
            createDate: new Date().toISOString()
        }
        accountTradeRecordSecurity.accountTradeRecordSignature(tradeRecordInfo)
        //流水记录后期可以考虑在其他地方单独记录,例如账户收到款项处理完以后,发送消息到MQ.
        await this.accountTradeRecordProvider.create(tradeRecordInfo)
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