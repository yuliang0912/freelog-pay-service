'use strict'

module.exports = app => {

    const {router, controller} = app
    const {account, cardClip, pay, helper} = controller

    //支付接口
    router.post('/v1/pay/payment', pay.v1.payment)
    router.post('/v1/pay/recharge', pay.v1.recharge)
    router.post('/v1/pay/transfer', pay.v1.transfer)
    router.post('/v1/pay/officialTap', pay.v1.officialTap)
    router.post('/v1/pay/inquirePayment', pay.v1.inquirePayment)
    router.post('/v1/pay/inquireTransfer', pay.v1.inquireTransfer)

    router.get('/v1/pay/paymentOrders', pay.v1.paymentOrders)
    router.get('/v1/pay/paymentOrderInfo', pay.v1.paymentOrderInfo)
    router.get('/v1/pay/outsideTradeState', pay.v1.outsideTradeState)

    //eth工具接口
    router.get('/v1/pay/helper/feather/clearKeyStore', helper.feather.clearKeyStore)
    router.get('/v1/pay/helper/feather/downLoadKeyStore', helper.feather.downLoadKeyStore)
    router.get('/v1/pay/helper/feather/ethTransactionReceipt',helper.feather.ethTransactionReceipt)
    router.post('/v1/pay/helper/feather/createEthAccount', helper.feather.createEthAddress)


    //账户接口
    router.get('/v1/pay/accounts/tradeRecords', account.v1.tradeRecords)
    router.post('/v1/pay/accounts/createNodeAccount', account.v1.createNodeAccount)
    router.post('/v1/pay/accounts/createContractAccount', account.v1.createContractAccount)

    //rest-ful接口
    router.resources('账户API', '/v1/pay/accounts', account.v1)
    router.resources('卡包API', '/v1/pay/cardclips', cardClip.v1)
    router.resources('支付API', '/v1/pay', pay.v1)
}