/**
 * Created by yuliang on 2017/9/11.
 */

'use strict';

module.exports = app => {

    const accountController = app.controller.account.v1

    /**
     * 账号相关REST-API
     */
    app.resources('账户API', '/v1/pay/accounts', accountController)

    /**
     * 支付密码相关REST-API
     */
    app.resources('支付密码API', '/v1/pay/password', app.controller.password.v1)

    /**
     * 支付相关
     */
    app.resources('支付密码API', '/v1/pay', app.controller.pay.v1)


    app.post('/v1/pay/accounts/createEthAccount', accountController.createEthAccount)

    app.get('/v1/pay/accounts/clearKeyStore', accountController.clearKeyStore)

    app.get('/v1/pay/accounts/downLoadKeyStore', accountController.downLoadKeyStore)

    app.get('/v1/pay/ethTransactionReceipt/:transactionId', app.controller.pay.v1.ethTransactionReceipt)


    /**
     * 获取账户余额
     */
    app.get('/v1/pay/accounts/balance/:accountId', accountController.balance)

    //app.post('/v1/pay/payForContract', app.controller.pay.v1.payForContract)

}