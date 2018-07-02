'use strict'

const uuid = require('node-uuid')
const queue = require('async/queue')
const ethTransferRegex = require('../extend/enum/ethTransferRegex')
const payServiceEvent = require('../mq-service/mq-event-type').payService
const globalInfo = require('egg-freelog-base/globalInfo')

module.exports = class FeatherTransferHandlerQueue {

    constructor(concurrencyCount = 5) {
        this.concurrencyCount = concurrencyCount
        this.queue = queue(this.taskHandler, concurrencyCount)
    }

    /**
     * 添加待触发对象到队列
     * @param contractEvents
     */
    push(transferEvents) {
        if (Array.isArray(transferEvents)) {
            transferEvents.forEach(event => this.queue.push(event))
        } else if (transferEvents) {
            this.queue.push(transferEvents)
        }
    }

    /**
     * 暂停执行
     */
    pause() {
        this.queue.pause()
    }

    /**
     * 继续执行
     */
    resume() {
        this.queue.resume()
    }

    /**
     * 获取队列状态
     * @returns {{started: (*|boolean), paused: (*|boolean), saturated: (*|Function)}}
     */
    get queueState() {
        return {
            started: this.queue.started,
            paused: this.queue.paused,
            saturated: this.queue.saturated,
        }
    }

    /**
     * 处理函数
     * @param task
     * @param callback 形参必须存在,提供给queue调用done函数
     */
    async taskHandler(transferEvent, callback) {

        const {app} = globalInfo
        const ethAccounts = {}
        const {dal, rabbitClient, ethClient} = app

        await dal.accountProvider.getAccountList({
            accountType: 1,
            cardNo: {$in: [transferEvent.to, transferEvent.from]}
        }).catch(err => console.log('定时任务获取数据失败')).each(item => ethAccounts[item.cardNo] = item)

        const transferHandleRecord = {
            transferId: transferEvent.hash,
            transferType: 1, //feather
            handleInfo: {
                handleStatus: 1
            },
            otherInfo: {
                messageId: uuid.v4().replace(/-/g, '')
            },
            status: 1
        }

        if (Reflect.has(ethAccounts, transferEvent.from)) {
            transferHandleRecord.handleInfo.accountFrom = ethAccounts[transferEvent.from].accountId
            transferHandleRecord.handleInfo.fromUserId = ethAccounts[transferEvent.from].userId
        }

        if (Reflect.has(ethAccounts, transferEvent.to)) {
            transferHandleRecord.handleInfo.accountTo = ethAccounts[transferEvent.to].accountId
            transferHandleRecord.handleInfo.toUserId = ethAccounts[transferEvent.to].userId
        }

        //测试数据
        //transferEvent.returnValues.data = 'contract:5a41ef71ae82e60020fa31af'
        //transferEvent.returnValues.value = 100


        //合同支付=>发送支付事件,合同服务订阅支付事件
        if (ethTransferRegex.contractTransfer.test(transferEvent.returnValues.data)) {
            //交易是以飞致账户为基础,如果没有飞致账户则视为未知的交易事件
            if (!transferHandleRecord.handleInfo.toUserId) {
                transferHandleRecord.handleInfo.handleStatus = 5
            }
            else {
                await rabbitClient.publish({
                    routingKey: payServiceEvent.payForContract.routingKey,
                    eventName: payServiceEvent.payForContract.eventName,
                    options: {messageId: transferHandleRecord.otherInfo.messageId},
                    body: {
                        transferId: transferHandleRecord.transferId,
                        accountFrom: transferHandleRecord.handleInfo.accountFrom,
                        accountTo: transferHandleRecord.handleInfo.accountTo,
                        fromUserId: transferHandleRecord.handleInfo.fromUserId,
                        toUserId: transferHandleRecord.handleInfo.toUserId,
                        accountType: transferHandleRecord.transferType, //feather
                        amount: transferEvent.returnValues.value,
                        contractId: transferEvent.returnValues.data.replace('contract:', '')
                    }
                }).then(ret => {
                    console.log('事件发送结果:' + ret)
                    transferHandleRecord.handleInfo.handleStatus = 2
                }).catch(error => {
                    transferHandleRecord.handleInfo.handleStatus = 4
                    console.error(error)
                })
            }
        }

        const task1 = ethClient.CoinContract.methods.balanceOf(transferEvent.to).call(ethClient.adminInfo)
        const task2 = ethClient.CoinContract.methods.balanceOf(transferEvent.from).call(ethClient.adminInfo)

        Promise.all([task1, task2]).then(([balanceOfAccountTo, balanceOfAccountFrom]) => {
            dal.accountProvider.updateAccount({balance: balanceOfAccountTo}, {cardNo: transferEvent.to})
            dal.accountProvider.updateAccount({balance: balanceOfAccountFrom}, {cardNo: transferEvent.from})
        }).catch(console.error)

        await dal.transferHandleProvider.addTransferHandleRecord(transferHandleRecord)
            .then(callback).catch(callback)
    }
}