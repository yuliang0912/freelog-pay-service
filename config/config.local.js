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

        web3RpcUri: 'http://119.23.45.143:8546',

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



