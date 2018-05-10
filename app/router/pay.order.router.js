'use strict'

module.exports = app => {

    const payControllerV1 = app.controller.pay.v1


    //获取账户余额
    app.get('/v1/pay/orderInfo', payControllerV1.orderInfo)

    //获取以太坊交易结果
    app.get('/v1/pay/ethTransactionReceipt/:transactionId', payControllerV1.ethTransactionReceipt)

    //支付相关REST-API
    app.resources('支付订单API', '/v1/pay', payControllerV1)
}