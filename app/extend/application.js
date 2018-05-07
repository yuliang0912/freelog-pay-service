const moment = require('moment')
const rabbitClient = require('./helper/rabbit_mq_client')
const Web3Client = require('./web3/web3-client')

module.exports = {

    get rabbitClient() {
        return rabbitClient.Instance
    },

    initRabbitClient() {
        return new rabbitClient(this.config.rabbitMq)
    },

    get ethClient() {
        return new Web3Client(this.config)
    },

    moment
}