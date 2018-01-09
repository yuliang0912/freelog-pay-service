'use strict'

const Subscription = require('egg').Subscription;

module.exports = class KeepAlived extends Subscription {

    static get schedule() {
        return {
            cron: '0 */5 * * * * *',  //5秒定时检查一次是否有新的支付事件
            type: 'all', // 指定一个 worker需要执行
            immediate: false, //立即执行一次
        };
    }


    async subscribe() {
        this.keepAlivedRabbit()
    }


    /**
     * 保持rabbitMq连接
     */
    keepAlivedRabbit() {
        let {rabbitClient, logger} = this.app

        rabbitClient.isReady && rabbitClient.publish({
            routingKey: 'heartBeat',
            eventName: null,
            body: {message: '心跳检测包'},
            options: {mandatory: false}
        }).then(() => {
            logger.info('rabbit mq keepalived')
        }).catch((err) => {
            logger.error('rabbit mq keepalived error:' + err.toString())
        })
    }
}
