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
    }
}



