'use strict'

const queue = require('async/queue')
const {tradeType, tradeStatus, accountEvent} = require('../../enum/index')

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
     */
    async accountAmountChangedEventHandler({transferRecordInfo, fromAccountInfo, toAccountInfo}) {

        if (transferRecordInfo.tradeStatus !== tradeStatus.Successful) {
            return
        }

        const {transferId, amount, operationUserId, remark} = transferRecordInfo
        this.sendAccountAmountChangedEvent({
            accountInfo: toAccountInfo,
            correlativeAccountId: fromAccountInfo.accountId,
            amount, userId: operationUserId, remark,
            correlativeInfo: {
                transactionId: transferId, accountInfo: fromAccountInfo
            }
        })
        this.sendAccountAmountChangedEvent({
            accountInfo: fromAccountInfo,
            amount: amount * -1, userId: operationUserId, remark,
            correlativeInfo: {
                transactionId: transferId, accountInfo: toAccountInfo
            }
        })
    }

    /**
     * 发送账户金额变更事件
     * @param accountInfo
     * @param amount
     */
    sendAccountAmountChangedEvent({accountInfo, correlativeInfo, amount, userId, remark}) {

        const {accountId, balance} = accountInfo
        const accountAmountChangedEventParams = {
            accountId, correlativeInfo, amount, userId,
            tradeDesc: '转账',
            beforeBalance: balance + amount * -1,
            remark: remark || '转账',
            tradePoundage: 0,
            tradeType: tradeType.Transfer,
            afterBalance: balance,
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