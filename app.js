/**
 * Created by yuliang on 2017/9/11.
 */


'use strict'

const mongoDb = require('./app/models/db_start')
const path = require('path')
const subscribe = require('./app/mq-service/subscribe')
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

    app.ethClient = new Web3Client(app)

    //app.loader.loadToApp(path.join(app.config.baseDir, 'app/event-handler'), 'eventHandler');

    await subscribe(app)

    await mongoDb.connect(app)
}