'use strict'

module.exports = app => {

    const {router, controller} = app
    const {account, cardClip, pay, helper} = controller

    router.post('/v1/pay/officialTap', pay.v1.officialTap)
    router.post('/v1/pay/transfer', pay.v1.transfer)
    router.post('/v1/pay/recharge', pay.v1.recharge)
    router.post('/v1/pay/payment', pay.v1.payment)
    router.get('/v1/pay/paymentOrders', pay.v1.paymentOrders)
    router.get('/v1/pay/paymentOrderInfo', pay.v1.paymentOrderInfo)
    router.get('/v1/pay/outsideTradeState', pay.v1.outsideTradeState)
    router.get('/v1/pay/accounts/tradeRecords', account.v1.tradeRecords)

    //创建eth账户
    router.post('/v1/pay/helper/feather/createEthAccount', helper.feather.createEthAddress)
    //清理keystore
    router.get('/v1/pay/helper/feather/clearKeyStore', helper.feather.clearKeyStore)
    //下载keystore
    router.get('/v1/pay/helper/feather/downLoadKeyStore', helper.feather.downLoadKeyStore)

    router.resources('账户API', '/v1/pay/accounts', account.v1)
    router.resources('卡包API', '/v1/pay/cardclips', cardClip.v1)
    router.resources('支付API', '/v1/pay', pay.v1)

}