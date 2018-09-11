'use strict'

const Patrun = require('patrun')
const rabbit = require('../extend/helper/rabbit_mq_client')
const {outsideTradeEvent} = require('../enum/index')

module.exports = class RabbitMessageQueueEventHandler {

    constructor(app) {
        this.app = app
        this.handlerPatrun = this.__registerEventHandler__()
        this.handleMessage = this.handleMessage.bind(this)
        this.subscribe()
    }

    /**
     * 订阅rabbitMQ消息
     */
    subscribe() {
        return new rabbit(this.app.config.rabbitMq).connect().then(client => {
            //订阅询问支付确认函结果队列
            client.subscribe('[pay]-inquire-payment-result', this.handleMessage)

            client.subscribe('[pay]-auth-event-handle-result', this.handleMessage)

        }).catch(console.error)
    }

    /**
     * rabbitMq事件处理主函数
     * @param message
     * @param headers
     * @param deliveryInfo
     * @param messageObject
     */
    async handleMessage(message, headers, deliveryInfo, messageObject) {

        const givenEventHandler = this.handlerPatrun.find({
            eventName: headers.eventName,
            queueName: deliveryInfo.queue,
            routingKey: messageObject.routingKey,
        })

        if (givenEventHandler) {
            await givenEventHandler({message, headers, deliveryInfo, messageObject}).catch(console.error)
        } else {
            console.log(`不能处理的未知事件,queueName:${deliveryInfo.queue},routingKey:${messageObject.routingKey},eventName:${headers.eventName}`)
        }

        messageObject.acknowledge(false)
    }

    /**
     * 注册事件处理函数
     * @private
     */
    __registerEventHandler__() {

        const patrun = Patrun()

        patrun.add({queueName: '[pay]-inquire-payment-result'}, async ({message}) => {
            this.app.emit(outsideTradeEvent.obtainInquirePaymentResultEvent, message)
        })

        //直接触发合同事件
        // patrun.add({queueName: '[pay]-auth-event-handle-result'}, async ({message}) => {
        //
        //     if (!message.message) {
        //         console.log('无效的数据:', message)
        //         return
        //     }
        //
        //     const {payOrderProvider, transferHandleProvider} = this.app.dal
        //     const model = {
        //         'handleInfo.handleStatus': message.error === null ? 3 : 4,
        //         'handleInfo.result': message.result,
        //         'handleInfo.error': message.error
        //     }
        //
        //     await payOrderProvider.update({status: message.error === null ? 2 : 3}, {transferId: message.message.transferId})
        //     await transferHandleProvider.updateTransferHandleRecord(model, {transferId: message.message.transferId}).then(ret => {
        //         console.log(`保存事件回执结果`, message.message.transferId, ret)
        //     }).catch(console.error)
        // })

        return patrun
    }
}