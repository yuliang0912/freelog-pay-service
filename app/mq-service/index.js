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
            client.subscribe('pay#inquire-payment-result', this.handleMessage)
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

        patrun.add({
            queueName: 'pay#inquire-payment-result',
            eventName: 'replyAndSetInquirePaymentResult'
        }, async ({message}) => {
            this.app.emit(outsideTradeEvent.obtainInquirePaymentResultEvent, message)
        })

        patrun.add({
            queueName: 'pay#inquire-payment-result',
            eventName: 'replyAndSetInquireTransferResult'
        }, async ({message}) => {
            this.app.emit(outsideTradeEvent.obtainInquireTransferResultEvent, message)
        })

        return patrun
    }
}