'use strict'


const Web3 = require('web3')
const client = Symbol('web3#client')
const coinContract = Symbol('web3#coinContract')
const officaialOps = Symbol('web3#officaialOps')
const ethContractInfo = require('./eth-contract-abi/index')


module.exports = class Web3Client {

    constructor(app) {

        this.config = app.config.web3

        let web3 = this[client] = new Web3(this.config.rpcUri)

        this[coinContract] = new web3.eth.Contract(ethContractInfo.Coin.abi, ethContractInfo.Coin.address)
        this[officaialOps] = new web3.eth.Contract(ethContractInfo.OfficaialOps.abi, ethContractInfo.OfficaialOps.address)
    }

    /**
     * 以太坊货币合同
     * @returns {*}
     */
    get CoinContract() {
        return this[coinContract]
    }


    /**
     * 以太坊官方管理合同
     * @returns {*}
     */
    get OfficaialOpsContract() {
        return this[officaialOps]
    }

    /**
     * 获取eth客户端
     * @returns {*}
     */
    get client() {
        return this[client]
    }

    /**
     * 获取eth客户端
     * @returns {*}
     */
    get web3() {
        return this[client]
    }

    /**
     * 获取当前系统管理员账户信息
     * @returns {{from: string}}
     */
    get adminInfo() {
        return {
            from: ethContractInfo.account.admin
        }
    }

    get ethContractInfo() {
        return ethContractInfo
    }
}
