'use strict'

const concurrencyCount = 3
const queue = require('async/queue')
const {tradeType, tradeStatus, currencyType, accountEvent} = require('../../enum/index')

module.exports = class FeatherTransferEventHandler {

    constructor(app) {
        this.app = app
        this.maxBlockNumber = 0
        this.accountPendTradeProvider = app.dal.accountPendTradeProvider
        this.ethTransferBlockNumProvider = app.dal.ethTransferBlockNumProvider
        this.queue = queue(this.featherTransferEventHandler.bind(this), concurrencyCount)
    }

    /**
     * feather交易事件处理
     * @param transferEvents
     */
    async handler(transferEvents) {
        if (Array.isArray(transferEvents)) {
            transferEvents.forEach(event => this.queue.push(event))
        } else if (transferEvents) {
            this.queue.push(transferEvents)
        }
    }

    /**
     * 处理函数
     * @param task
     * @param callback 形参必须存在,提供给queue调用done函数
     */
    async featherTransferEventHandler(transferEvent, callback) {

        const {app, accountPendTradeProvider} = this
        const {transactionHash, returnValues, blockNumber, type} = transferEvent
        const {from, to, value, _data} = returnValues

        const accountPendTrade = await accountPendTradeProvider.findOne({
            outsideTradeId: transactionHash,
            currencyType: currencyType.ETH
        })

        if (!accountPendTrade) {
            return this.retry(transferEvent, callback)
        }
        if (accountPendTrade.cardNo.toLowerCase() !== from.toLowerCase() || accountPendTrade.tradeStatus !== tradeStatus.Pending || accountPendTrade.amount.toString() !== value.toString()) {
            return this.handComplete(transferEvent, callback)
        }

        await accountPendTrade.updateOne({tradeStatus: tradeStatus.Successful})

        if (accountPendTrade.tradeType === tradeType.Recharge) {
            app.emit(accountEvent.accountRechargeCompletedEvent, accountPendTrade)
        } else {
            console.log('不支持的交易类型,目前只支持充值类型的事件,请检查代码')
        }
    }

    /**
     * 已处理完毕
     * @param transferEvent
     */
    handComplete(transferEvent, callback) {
        if (this.maxBlockNumber === 0) {
            this.updateBlockNumber()
        }
        if (transferEvent.blockNumber > this.maxBlockNumber) {
            this.maxBlockNumber = transferEvent.blockNumber
        }
        callback()
    }

    /**
     * 定时同步更新处理的区块编号
     */
    updateBlockNumber() {
        setInterval(() => this.ethTransferBlockNumProvider.setBlockNumber(this.maxBlockNumber), 2000)
    }

    /**
     * 重试,防止事件接受到时,交易等待数据还未写入DB
     * 公链上基本不会出现这种问题.预防testrpc上可能出现此问题.
     * @param transferEvent
     */
    retry(transferEvent, callback) {
        if (!Reflect.has(transferEvent, 'retryCount')) {
            transferEvent.retryCount = 1
            setTimeout(() => this.queue.push(transferEvent), 3000)
        }
        this.handComplete(transferEvent, callback)
    }
}