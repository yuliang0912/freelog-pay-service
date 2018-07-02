'use strict'

module.exports = app => {

    const {router, controller} = app
    const {pay} = controller
    
    //获取账户余额
    router.get('/v1/pay/orderInfo', pay.v1.orderInfo)

    //获取以太坊交易结果
    router.get('/v1/pay/ethTransactionReceipt/:transactionId', pay.v1.ethTransactionReceipt)

    //支付相关REST-API
    router.resources('支付订单API', '/v1/pay', pay.v1)
}