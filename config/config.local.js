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

        web3RpcUri: 'http://119.23.45.143:8546',

        Coin: {
            address: '0x64d4ed053026b92cfeb278840adcf93e7c57ca0e',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/Coin.abi'), 'utf-8'))
        },

        OfficialOps: {
            address: '0x6587b53be10421cd192a523b8bfb751ec8fff0ad',
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, '../app/extend/web3/eth-contract-abi/OfficialOps.abi'), 'utf-8'))
        },

        account: {
            admin: '0xf4b1be25c839d0af1d12ab2ff53b4c1b3765a1ed',
            freelog: '0xa7646f209b5c19d1917f48f8fb201ea8d72fd70a'
        }
    }
}



