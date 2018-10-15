'use strict'

const {tradeStatus} = require('../../enum/index')
const {EmitInquireTransfer} = require('../../enum/rabbit-mq-event')

module.exports = class EmitInquireTransferEventHandler {

    constructor(app) {
        this.app = app
        this.accountTransferRecordProvider = app.dal.accountTransferRecordProvider
    }

    /**
     * 发起询问转账事件
     */
    async handler(transferRecord, refParam) {
        await this.app.rabbitClient.publish(Object.assign({}, EmitInquireTransfer, {body: {transferRecord, refParam}}))
            .catch(error => this.callback(error, transferRecord))
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("emit-inquire-transfer-event-handler事件执行异常", ...arguments)
            this.app.logger.error("emit-inquire-transfer-event-handler事件执行异常", ...arguments)
        }
    }
}