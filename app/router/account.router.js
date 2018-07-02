'use strict'

module.exports = app => {

    const {router, controller} = app
    const {account} = controller

    //创建eth账户
    router.post('/v1/pay/accounts/createEthAccount', account.v1.createEthAccount)

    //清理keystore
    router.get('/v1/pay/accounts/clearKeyStore', account.v1.clearKeyStore)

    //下载keystore
    router.get('/v1/pay/accounts/downLoadKeyStore', account.v1.downLoadKeyStore)

    //官方tap feather
    router.get('/v1/pay/accounts/officaialTap', account.v1.officaialTap)

    //获取账户余额
    router.get('/v1/pay/accounts/balance/:accountId', account.v1.balance)
    
    //账号相关REST-API
    router.resources('账户API', '/v1/pay/accounts', account.v1)
}