'use strict'

module.exports = app => {

    const payPasswordControllerV1 = app.controller.password.v1

    //支付密码API
    app.resources('支付密码API', '/v1/pay/password', payPasswordControllerV1)
}