/**
 * Created by yuliang on 2017/9/11.
 */


'use strict'

const path = require('path')
const mongoDb = require('./app/models/db_start')
const subscribe = require('./app/mq-service/subscribe')
const featherInit = require('./init/feather-contract-init')
const Web3Client = require('./app/extend/web3/web3-client')

module.exports = async (app) => {

    app.on('error', (err, ctx) => {
        if (!err || !ctx) {
            return
        }

        ctx.body = ctx.buildReturnObject(app.retCodeEnum.serverError,
            app.errCodeEnum.autoSnapError,
            err.message || err.toString())
    })

    app.ethClient = new Web3Client(app.config)

    //await featherInit(app)

    await subscribe(app)

    await mongoDb.connect(app)


}