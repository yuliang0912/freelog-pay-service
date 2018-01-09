'use strict'

module.exports = app => {

    const accountControllerV1 = app.controller.account.v1

    //账号相关REST-API
    app.resources('账户API', '/v1/pay/accounts', accountControllerV1)

    //创建eth账户
    app.post('/v1/pay/accounts/createEthAccount', accountControllerV1.createEthAccount)

    //清理keystore
    app.get('/v1/pay/accounts/clearKeyStore', accountControllerV1.clearKeyStore)

    //下载keystore
    app.get('/v1/pay/accounts/downLoadKeyStore', accountControllerV1.downLoadKeyStore)

    //官方tap feather
    app.get('/v1/pay/accounts/officaialTap', accountControllerV1.officaialTap)

    //获取账户余额
    app.get('/v1/pay/accounts/balance/:accountId', accountControllerV1.balance)
}