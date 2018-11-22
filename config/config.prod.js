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

        web3RpcUri: 'http://172.18.215.231:8547',

        Coin: {
            address: '0x91cc71ea078789968ffc35bc8d813b5494405540',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/Coin.abi'), 'utf-8'))
        },

        OfficialOps: {
            address: '0x57d6931b56358d76ae8321a2eee0d5327bfa336f',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/OfficialOps.abi'), 'utf-8'))
        },

        account: {
            admin: '0xe4ac855822b0de2981ac1a12501b26c87b51a7ba',
            freelog: '0x1b6dcebc8c794836cdaf686de72e48dc35c51be5'
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