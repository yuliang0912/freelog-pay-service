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

        web3RpcUri: 'http://119.23.45.143:8547',

        Coin: {
            address: '0xd0f13909466f8e4152e5a6384a3cca1b8b03c0f6',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/Coin.abi'), 'utf-8'))
        },

        OfficialOps: {
            address: '0xeb39e2286a65aab50acb075df5806e7e0adb48f2',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/OfficialOps.abi'), 'utf-8'))
        },

        account: {
            admin: '0x3e3b39c2028a639375d6ffed188fedbafc10b3b5',
            freelog: '0x00cc33c3d768e903de8126a92a11e59ce5ef0c25'
        }
    }
}



