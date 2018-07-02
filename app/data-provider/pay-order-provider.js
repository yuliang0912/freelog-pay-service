'use strict'

const uuid = require('node-uuid')
const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class PayOrderClass extends MongoBaseOperation {

    constructor(app) {
        super(app.model.PayOrder)
        this.app = app
    }

    /**
     * 创建支付记录
     * @param model
     */
    createPayOrder(model) {

        const order = {
            transferId: model.transferId,
            salt: uuid.v4().replace(/-/g, ''),
            sendAccountInfo: model.sendAccountInfo,
            receiveAccountInfo: model.receiveAccountInfo,
            targetId: model.targetId,
            orderType: model.orderType,
            payAmount: model.amount,
            transferSign: {
                alg: 'HMAC1',
                value: 'fsafdsafdas'
            },
            status: model.status
        }

        return super.create(order)
    }


    /**
     * 获取订单列表
     * @param condition
     * @param projection
     * @param page
     * @param pageSize
     * @returns {*}
     */
    getPayOrderPageList(condition, projection, page, pageSize) {

        var options = {}
        const {type} = this.app
        if (type.int32(page) && type.int32(pageSize)) {
            options = {skip: (page - 1) * pageSize, limit: pageSize}
        } else if (type.int32(pageSize)) {
            options = {limit: pageSize}
        }

        var totalItem = 0
        return super.count(condition).then(count => {
            totalItem = count
            return totalItem > (page - 1) * pageSize ? super.find(condition, projection, options) : []
        }).then(dataList => new Object({
            page, pageSize, totalItem, dataList
        }))
    }
}
