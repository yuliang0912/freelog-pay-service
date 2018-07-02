/**
 * Created by yuliang on 2017/9/11.
 */


'use strict'

const subscribe = require('./app/mq-service/index')
const featherInit = require('./init/feather-contract-init')

module.exports = async (app) => {

    //await featherInit(app)

    new subscribe(app)
}