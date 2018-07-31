'use strict'

const moment = require('moment')
const web3ClientKey = Symbol('app#web3Client')
const Web3Client = require('./web3/web3-client')
const restfulWebApiKey = Symbol('app#restfulWebApiKey')
const restfulWebApi = require('./restful-web-api/index')
const rabbitClient = require('./helper/rabbit_mq_client')

module.exports = {

    get rabbitClient() {
        return rabbitClient.Instance
    },

    initRabbitClient() {
        return new rabbitClient(this.config.rabbitMq)
    },


    get ethClient() {
        if (!this.__cacheMap__.has(web3ClientKey)) {
            this.__cacheMap__.set(web3ClientKey, new Web3Client(this.config))
            setTimeout(() => this.__cacheMap__.delete(web3ClientKey), 1000 * 60 * 60)
        }
        return this.__cacheMap__.get(web3ClientKey)
    },

    get webApi() {
        if (!this.__cacheMap__.has(restfulWebApiKey)) {
            this.__cacheMap__.set(restfulWebApiKey, new restfulWebApi(this.config))
        }
        return this.__cacheMap__.get(restfulWebApiKey)
    },

    moment
}