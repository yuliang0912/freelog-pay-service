'use strict'

const queue = require('async/queue')
const {tradeType, accountEvent} = require('../../enum/index')

module.exports = class AccountTransferEventHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.accountAmountChangedEventHandler.bind(this), 3)
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

        const {fromAccountInfo, toAccountInfo, amount, userId, remark} = args
        this.sendAccountAmountChangedEvent({accountInfo: toAccountInfo, amount, userId, remark})
        this.sendAccountAmountChangedEvent({accountInfo: fromAccountInfo, amount: amount * -1, userId, remark})
    }

    /**
     * 发送账户金额变更事件
     * @param accountInfo
     * @param amount
     */
    sendAccountAmountChangedEvent({accountInfo, amount, userId, remark}) {

        const {accountId, balance} = accountInfo
        const accountAmountChangedEventParams = {
            amount, userId, accountId,
            beforeBalance: balance + amount * -1,
            remark: remark || '转账',
            tradePoundage: 0,
            tradeType: tradeType.Transfer,
            afterBalance: balance
        }

        this.app.emit(accountEvent.accountAmountChangedEvent, accountAmountChangedEventParams)
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("transfer-event-handler", '事件执行异常', error)
            this.app.logger.error("transfer-event-handler", '事件执行异常', error)
        }
    }
}