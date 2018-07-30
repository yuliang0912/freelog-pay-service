'use strict'

const Web3 = require('web3')
const client = Symbol('web3#client')
const coinContract = Symbol('web3#coinContract')
const OfficialOps = Symbol('web3#OfficialOps')
const ethContractInfo = require('./eth-contract-abi/index')

module.exports = class Web3Client {

    constructor(config) {
        this.config = config
        let web3 = this[client] = new Web3(new Web3.providers.HttpProvider(this.config.web3.rpcUri));
        this[coinContract] = new web3.eth.Contract(ethContractInfo.Coin.abi, ethContractInfo.Coin.address)
        this[OfficialOps] = new web3.eth.Contract(ethContractInfo.OfficialOps.abi, ethContractInfo.OfficialOps.address)
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
    get OfficialOpsContract() {
        return this[OfficialOps]
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
        return {from: ethContractInfo.account.admin}
    }


    get ethContractInfo() {
        return ethContractInfo
    }

    /**
     * 飞致网络平台账号(非官方管理资金池账号)
     * @returns {string}
     */
    get platformAccountAddress() {
        return ethContractInfo.account.freelog
    }
}
