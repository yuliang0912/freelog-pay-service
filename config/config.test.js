'use strict'

const fs = require('fs')
const path = require('path')

module.exports = {

    cluster: {listen: {port: 5055}},

    mongoose: {
        url: "mongodb://mongo-test.common:27017/pay"
    },

    rabbitMq: {
        connOptions: {
            host: 'rabbitmq-test.common',
            port: 5672,
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
            address: '0x64d4ed053026b92cfeb278840adcf93e7c57ca0e',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/Coin.abi'), 'utf-8'))
        },

        OfficialOps: {
            address: '0x6587b53be10421cd192a523b8bfb751ec8fff0ad',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/OfficialOps.abi'), 'utf-8'))
        },

        account: {
            admin: '0xf4b1be25c839d0af1d12ab2ff53b4c1b3765a1ed',
            freelog: '0xa7646f209b5c19d1917f48f8fb201ea8d72fd70a'
        }
    }
}