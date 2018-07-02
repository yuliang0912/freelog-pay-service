const moment = require('moment')
const rabbitClient = require('./helper/rabbit_mq_client')
const Web3Client = require('./web3/web3-client')

let webInstance = null

module.exports = {

    get rabbitClient() {
        return rabbitClient.Instance
    },

    initRabbitClient() {
        return new rabbitClient(this.config.rabbitMq)
    },

    get ethClient() {
        if (webInstance == null) {
            webInstance = new Web3Client(this.config)
            //每小时重新创建一个web3实例
            setTimeout(() => {
                webInstance = null
            }, 1000 * 60 * 60)
        }
        return webInstance
    },

    moment
}