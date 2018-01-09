/**
 * Created by yuliang on 2017/9/11.
 */

'use strict';

const accountRouter = require('./router/account.router')

module.exports = app => {

    accountRouter(app)

    /**
     * 支付密码相关REST-API
     */
    app.resources('支付密码API', '/v1/pay/password', app.controller.password.v1)

    /**
     * 支付相关
     */
    app.resources('支付密码API', '/v1/pay', app.controller.pay.v1)

    /**
     * 获取以太坊交易结果
     */
    app.get('/v1/pay/ethTransactionReceipt/:transactionId', app.controller.pay.v1.ethTransactionReceipt)


    //app.post('/v1/pay/payForContract', app.controller.pay.v1.payForContract)
}