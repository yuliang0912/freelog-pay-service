'use strict'

module.exports = app => {

    const {router, controller} = app
    const {password} = controller

    //支付密码API
    router.resources('支付密码API', '/v1/pay/password', password.v1)
}