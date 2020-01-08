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


    ethereum: {

        web3RpcUri: 'http://119.23.45.143:8547',

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
    }
}



