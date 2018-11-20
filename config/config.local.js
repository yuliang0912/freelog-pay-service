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



