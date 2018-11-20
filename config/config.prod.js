'use strict'

const fs = require('fs')
const path = require('path')

module.exports = {

    gatewayUrl: "http://172.18.215.224:8895",

    mongoose: {
        url: "mongodb://172.18.215.231:27017/pay"
    },

    rabbitMq: {
        connOptions: {
            host: '172.18.215.231',
            port: 5672,
            login: 'prod_user_pay',
            password: 'rabbit@freelog',
            authMechanism: 'AMQPLAIN'
        }
    },

    /**
     * 以太坊相关配置
     */
    ethereum: {

        web3RpcUri: 'http://172.18.215.231:8545',

        Coin: {
            address: '0x30ce01a932580fed20fde3970dfa483e0c4463af',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/Coin.abi'), 'utf-8'))
        },

        OfficialOps: {
            address: '0xe80081371b9c7cf929e1a4459208e0744bfdfb58',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/OfficialOps.abi'), 'utf-8'))
        },

        account: {
            admin: '0x345971f7e3fed34b2d73cd03ec15fbe8a705ecd2',
            freelog: '0x345971f7e3fed34b2d73cd03ec15fbe8a705ecd2'
        }
    },

    /**
     * 上传文件相关配置
     */
    uploadConfig: {
        aliOss: {
            enable: true,
            accessKeyId: "LTAIy8TOsSnNFfPb",
            accessKeySecret: "Bt5yMbW89O7wMTVQsNUfvYfou5GPsL",
            bucket: "freelog-shenzhen",
            internal: true,
            region: "oss-cn-shenzhen",
            timeout: 180000
        },
        amzS3: {}
    },
}