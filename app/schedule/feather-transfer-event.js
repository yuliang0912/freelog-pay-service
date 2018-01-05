'use strict'

const Subscription = require('egg').Subscription;
const featherTransferHandlerQueue = new (require('../queue-service/feather-transfer-handler'))(2)

module.exports = class UpdateNodeTemplate extends Subscription {

    static get schedule() {
        return {
            cron: '*/5 * * * * * *',  //5秒定时检查一次是否有新的支付事件
            type: 'worker', // 指定一个 worker需要执行
            immediate: false, //立即执行一次
        };
    }

    async subscribe() {

        let {dataProvider, logger, config, ethClient} = this.app

        let lastBlock = await dataProvider.featherTransferProvider.getMaxBlockNumber()

        let fromBlock = lastBlock ? lastBlock.blockInfo.blockNumber + 1 : 0

        ethClient.CoinContract.getPastEvents('Transfer', {fromBlock}).then(events => {
            return events.map(item => {
                return {
                    hash: item.transactionHash,
                    from: item.returnValues.from,
                    to: item.returnValues.to,
                    blockInfo: item,
                    returnValues: {
                        from: item.returnValues.from,
                        to: item.returnValues.to,
                        value: item.returnValues.value,
                        data: Reflect.has(item.returnValues, '_data')
                            ? ethClient.web3.utils.hexToUtf8(item.returnValues._data) : undefined
                    }
                }
            })
        }).then(eventArray => {
            if (!eventArray.length) {
                return
            }
            dataProvider.featherTransferProvider.batchAddTransferInfos(eventArray)
            featherTransferHandlerQueue.push(eventArray)
        }).catch(err => {
            //logger.error(err)
            logger.error('无法连接到本地eth服务器:' + config.web3.rpcUri)
        })
    }
}