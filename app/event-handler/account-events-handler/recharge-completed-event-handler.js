'use strict'

const queue = require('async/queue')
const {tradeType, accountEvent} = require('../../enum/index')
const {accountInfoSecurity} = require('../../account-service/account-security/index')

module.exports = class AccountRechargeCompletedEventHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.accountRechargeCompletedEventHandler.bind(this), 3)
        this.accountProvider = app.dal.accountProvider
    }

    /**
     * 事件处理函数
     */
    handler() {
        this.queue.push(...arguments, this.callback.bind(this))
    }

    /**
     * 账户充值完成事件处理函数
     * @param task
     * @param callback 形参必须存在,提供给queue调用done函数
     */
    async accountRechargeCompletedEventHandler({accountId, amount, userId, cardNo, outsideTradeId, createDate}) {

        const {app} = this
        const accountInfo = await this.accountProvider.findOne({accountId})
        if (!accountInfoSecurity.accountSignVerify(accountInfo)) {
            app.emit(accountEvent.accountSignatureVerifyFailedEvent, accountInfo)
            return
        }
        if (amount < 0) {
            console.error('请检查系统异常')
        }

        accountInfo.balance = accountInfo.balance + amount
        accountInfoSecurity.accountInfoSignature(accountInfo)

        await this.accountProvider.update({accountId}, {
            balance: accountInfo.balance,
            signature: accountInfo.signature
        }).then(() => {
            this.sendAccountAmountChangedEvent({accountInfo, amount, userId, outsideTradeId})
            console.log(`账户${accountId}完成充值${amount},充值后金额${accountInfo.balance},充值卡号:${cardNo},外部交易号:${outsideTradeId}`)
        }).catch(console.error)
    }

    /**
     * 发送账户金额变动事件
     */
    sendAccountAmountChangedEvent({accountInfo, amount, userId, outsideTradeId}) {

        const {accountId, balance} = accountInfo
        const accountAmountChangedEventParams = {
            accountId, amount, userId,
            remark: `充值,外部交易号:${outsideTradeId}`,
            tradePoundage: 0,
            afterBalance: balance,
            tradeType: tradeType.Recharge,
            beforeBalance: balance - amount,
        }
        this.app.emit(accountEvent.accountAmountChangedEvent, accountAmountChangedEventParams)
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("recharge-completed-event-handler", '事件执行异常', error)
            this.app.logger.error("recharge-completed-event-handler", '事件执行异常', error)
        }
    }
}