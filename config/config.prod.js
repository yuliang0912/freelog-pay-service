'use strict'

const fs = require('fs')
const path = require('path')

module.exports = {

    mongoose: {
        url: "mongodb://mongo-prod.common:27017/pay"
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

        web3RpcUri: 'http://172.18.215.231:8547', //公网119.23.45.143

        Coin: {
            address: '0x6cd19679ff96166f6447d71adafaf6b69ed03a92',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/Coin.abi'), 'utf-8'))
        },

        OfficialOps: {
            address: '0xa4b8056d81b53db53f8f80c73acfa0b42d7671c7',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/OfficialOps.abi'), 'utf-8'))
        },

        account: {
            admin: '0xfdabcee81946d2a577387d306cb9f621458ff3a7',
            freelog: '0x22815a2b5f83aa4303aaaa74199c1fc7c8abb270'
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