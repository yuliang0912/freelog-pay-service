/**
 * Created by yuliang on 2017/9/11.
 */

'use strict'

const mqEventHandler = require('./mq-event-handler')
const eventHandlerMap = {
    /**
     * 创建合同事件
     */
    createContractEvent: mqEventHandler.createContractHandler
}


/**
 * event-handler入口
 * @param message
 * @param headers
 * @param deliveryInfo
 * @param messageObject
 */
module.exports.execEvent = (message, headers, deliveryInfo, messageObject) => {
    try {
        let eventName = headers.eventName
        if (Reflect.has(eventHandlerMap, eventName)) {
            eventHandlerMap[eventName](message, headers, deliveryInfo, messageObject)
        } else {
            console.log(`未找到事件handler,eventName:${eventName}`)
        }
    } catch (e) {
        console.error('=========event-hander-error-start==============')
        console.error(e)
        console.error('=========event-hander-error-end==============')
    }
}
