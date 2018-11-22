'use strict'

const fs = require('fs')
const path = require('path')

module.exports = {

    middleware: ['errorHandler', 'localUserIdentity'],

    /**
     * 本地开发环境身份信息
     */
    localIdentity: {
        userId: 10022,
        userName: "余亮",
        nickname: "烟雨落叶",
        email: "4896819@qq.com",
        mobile: "",
        tokenSn: "86cd7c43844140f2a4101b441537728f",
        userRol: 1,
        status: 1,
        createDate: "2017-10-20T16:38:17.000Z",
        updateDate: "2017-11-01T15:53:29.000Z",
        tokenType: "jwt"
    },

    /**
     * 以太坊相关配置
     */
    ethereum: {

        web3RpcUri: 'http://119.23.45.143:8545',

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
    }
}



