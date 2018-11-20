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
            address: '0x61c03c84de46a6bd6cb63c1b63690a04f69a5986',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/Coin.abi'), 'utf-8'))
        },

        OfficialOps: {
            address: '0xe3241568d73b3750b3e9a079e56c538c85457186',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/OfficialOps.abi'), 'utf-8'))
        },

        account: {
            admin: '0xff56bfc2f267ac81ed70213db0839c3daea273f6',
            freelog: '0xff56bfc2f267ac81ed70213db0839c3daea273f6'
        }
    }
}