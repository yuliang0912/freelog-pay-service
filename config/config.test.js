'use strict'

const fs = require('fs')
const path = require('path')

module.exports = {

    cluster: {listen: {port: 5055}},

    web3: {rpcUri: 'http://172.18.215.231:8546'},

    gatewayUrl: "http://172.18.215.224:8895/test",

    mongoose: {
        url: "mongodb://172.18.215.231:27018/pay"
    },

    rabbitMq: {
        connOptions: {
            host: '172.18.215.231',
            port: 5673,
            login: 'test_user_pay',
            password: 'rabbit@freelog',
            authMechanism: 'AMQPLAIN'
        }
    },

    /**
     * 上传文件相关配置
     */
    uploadConfig: {
        aliOss: {
            internal: true,
        },
        amzS3: {}
    },

    /**
     * 以太坊相关配置
     */
    ethereum: {

        web3RpcUri: 'http://172.18.215.231:8546',

        Coin: {
            address: '0xc93679bd9f038396d2845a6fbd488939874f40aa',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/Coin.abi'), 'utf-8'))
        },

        OfficialOps: {
            address: '0x8bc3cb917473d2549fb454754fe4599be2be3d37',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/OfficialOps.abi'), 'utf-8'))
        },

        account: {
            admin: '0x6b8d489197cfc97683e93b8cadf7c093ef26d628',
            freelog: '0x916dacff457a76654d92b529b4a9c9fbd0c40f72'
        }
    }
}