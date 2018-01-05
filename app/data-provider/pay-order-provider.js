'use strict'

const uuid = require('node-uuid')
const mongoBase = require('./mongodb-base')
const mongoModels = require('../models/index')

class PayOrderClass extends mongoBase {

    constructor(app) {
        super(app, mongoModels.paryOrder)
        this.type = app.type
    }

    /**
     * 创建支付记录
     * @param model
     */
    createPayOrder(model) {

        let order = {
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

        let options = {}
        if (this.type.int32(page) && this.type.int32(pageSize)) {
            options = {skip: (page - 1) * pageSize, limit: pageSize}
        } else if (this.type.int32(pageSize)) {
            options = {limit: pageSize}
        }

        let totalItem = 0
        return super.count(condition).then(count => {
            totalItem = count
            if (totalItem > (page - 1) * pageSize) {
                return super.getModelList(condition, projection, options)
            }
            return []
        }).then(dataList => {
            return {
                page, pageSize, totalItem, dataList
            }
        })
    }
}

module.exports = app => new PayOrderClass(app)
