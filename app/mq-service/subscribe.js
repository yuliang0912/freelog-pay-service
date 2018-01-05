/**
 * Created by yuliang on 2017/9/11.
 */

'use strict'

const rabbit = require('../extend/helper/rabbit_mq_client')
const eventHandler = require('./mq-event-handler-map')

module.exports = async (app) => {

    const dataProvider = app.dataProvider

    await new rabbit(app.config.rabbitMq).connect().then((client) => {

        //授权服务事件处理结果订阅
        client.subscribe('[pay]-auth-event-handle-result', async (message, headers, deliveryInfo, messageObject) => {

            let model = {
                'handleInfo.handleStatus': message.error === null ? 3 : 4,
                'handleInfo.result': message.result,
                'handleInfo.error': message.error
            }

            await dataProvider.payOrderProvider.update({status: message.error === null ? 2 : 3}, {transferId: message.message.transferId})
            await dataProvider.transferHandleProvider.updateTransferHandleRecord(model, {transferId: message.message.transferId}).then(ret => {
                console.log(`保存事件回执结果`, message.message.transferId, ret)
            }).catch(console.error)

            messageObject.acknowledge(false)
        })
    })
}