'use strict'

const queue = require('async/queue')
const {tradeType, accountEvent} = require('../../enum/index')
const {accountInfoSecurity} = require('../../account-service/account-security/index')

module.exports = class AccountRechargeCompletedEventHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.accountRechargeCompletedEventHandler.bind(this), 1)
        this.accountProvider = app.dal.accountProvider
    }

    /**
     * 事件处理函数
     */
    async handler() {
        this.queue.push(...arguments, this.errorHandler.bind(this))
    }

    /**
     * 账户充值完成事件处理函数
     * @param task
     * @param callback 形参必须存在,提供给queue调用done函数
     */
    async accountRechargeCompletedEventHandler(pendTradeInfo) {

        const {app} = this
        const {tradeId, accountId, amount, userId, cardNo, outsideTradeId} = pendTradeInfo

        var accountInfo = await this.accountProvider.findOne({accountId})
        if (!accountInfoSecurity.accountSignVerify(accountInfo)) {
            app.emit(accountEvent.accountSignatureVerifyFailedEvent, accountInfo)
            return
        }
        if (amount < 0) {
            console.error('请检查系统异常')
        }

        await this.accountProvider.findOneAndUpdate({accountId}, {$inc: {balance: amount}}, {new: true}).then(model => {
            accountInfo = model
            accountInfoSecurity.accountInfoSignature(accountInfo)
            return accountInfo.updateOne({signature: accountInfo.signature})
        })

        this.sendAccountAmountChangedEvent({accountInfo, amount, userId, transactionId: tradeId})
        console.log(`账户${accountId}完成充值${amount},充值后金额${accountInfo.balance},充值卡号:${cardNo},外部交易号:${outsideTradeId}`)
    }

    /**
     * 发送账户金额变动事件
     */
    sendAccountAmountChangedEvent({accountInfo, amount, userId, transactionId}) {

        const {accountId, balance} = accountInfo
        const accountAmountChangedEventParams = {
            accountId, amount, userId,
            tradeDesc: '充值',
            remark: `充值,记录号:${transactionId}`,
            tradePoundage: 0,
            afterBalance: balance,
            tradeType: tradeType.Recharge,
            beforeBalance: balance - amount,
            correlativeInfo: {transactionId, accountInfo}
        }

        this.app.emit(accountEvent.accountAmountChangedEvent, accountAmountChangedEventParams)
    }

    /**
     * 错误处理
     * @param err
     */
    errorHandler(error) {
        if (error instanceof Error) {
            console.log("recharge-completed-event-handler", '事件执行异常', error)
            this.app.logger.error("recharge-completed-event-handler", '事件执行异常', error)
        }
    }
}